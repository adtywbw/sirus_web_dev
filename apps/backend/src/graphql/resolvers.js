const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/pool');

const asUser = (ctx) => {
  if (!ctx.user) throw new Error('Unauthorized');
  return ctx.user;
};

const resolvers = {
  Query: {
    health: () => 'ok',
    me: async (_p, _a, ctx) => {
      if (!ctx.user) return null;
      const { rows } = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [
        ctx.user.id,
      ]);
      return rows[0] || null;
    },
    posts: async (_p, args) => {
      const where = [];
      const values = [];
      if (args.keyword) {
        values.push(`%${args.keyword}%`);
        where.push(`(p.title ILIKE $${values.length} OR p.content ILIKE $${values.length})`);
      }
      if (args.category_id) {
        values.push(args.category_id);
        where.push(`p.category_id = $${values.length}`);
      }
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const sql = `
        SELECT p.*, u.id as author_id, u.username, u.email, c.id as cat_id, c.name as cat_name
        FROM blog_posts p
        JOIN users u ON u.id = p.author_id
        LEFT JOIN categories c ON c.id = p.category_id
        ${whereSql}
        ORDER BY p.created_at DESC
      `;
      const { rows } = await pool.query(sql, values);
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content,
        image_url: r.image_url,
        created_at: r.created_at,
        updated_at: r.updated_at,
        author: { id: r.author_id, username: r.username, email: r.email, created_at: r.created_at },
        category: r.cat_id ? { id: r.cat_id, name: r.cat_name } : null,
      }));
    },
    post: async (_p, { id }) => {
      const { rows } = await pool.query(
        `SELECT p.*, u.id as author_id, u.username, u.email, c.id as cat_id, c.name as cat_name
         FROM blog_posts p
         JOIN users u ON u.id = p.author_id
         LEFT JOIN categories c ON c.id = p.category_id
         WHERE p.id = $1`,
        [id]
      );
      const r = rows[0];
      if (!r) return null;
      return {
        id: r.id,
        title: r.title,
        content: r.content,
        image_url: r.image_url,
        created_at: r.created_at,
        updated_at: r.updated_at,
        author: { id: r.author_id, username: r.username, email: r.email, created_at: r.created_at },
        category: r.cat_id ? { id: r.cat_id, name: r.cat_name } : null,
      };
    },
    categories: async () => {
      const { rows } = await pool.query('SELECT id, name FROM categories ORDER BY name ASC');
      return rows;
    },
  },
  Mutation: {
    register: async (_p, { username, email, password }) => {
      const hash = await bcrypt.hash(password, 10);
      const { rows } = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, hash]
      );
      const user = rows[0];
      const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET || '', { expiresIn: '7d' });
      return { token, user };
    },
    login: async (_p, { username, password }) => {
      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = rows[0];
      if (!user) throw new Error('Invalid credentials');
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) throw new Error('Invalid credentials');
      const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET || '', { expiresIn: '7d' });
      return { token, user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at } };
    },
    createPost: async (_p, { input }, ctx) => {
      const user = asUser(ctx);
      const { rows } = await pool.query(
        `INSERT INTO blog_posts (title, content, image_url, author_id, category_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [input.title, input.content, input.image_url || null, user.id, input.category_id || null]
      );
      const post = rows[0];
      return (await resolvers.Query.post(null, { id: post.id })) || post;
    },
    updatePost: async (_p, { id, input }, ctx) => {
      asUser(ctx);
      const fields = [];
      const values = [];
      let i = 1;
      for (const [k, v] of Object.entries(input)) {
        fields.push(`${k} = $${i++}`);
        values.push(v);
      }
      if (!fields.length) throw new Error('No fields to update');
      values.push(id);
      await pool.query(`UPDATE blog_posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i}`, values);
      return resolvers.Query.post(null, { id });
    },
    deletePost: async (_p, { id }, ctx) => {
      asUser(ctx);
      await pool.query('DELETE FROM blog_posts WHERE id = $1', [id]);
      return true;
    },
    createCategory: async (_p, { name }, ctx) => {
      asUser(ctx);
      const { rows } = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING id, name', [name]);
      return rows[0];
    },
  },
};

module.exports = { resolvers };

