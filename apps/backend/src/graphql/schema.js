const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    email: String!
    created_at: DateTime!
  }

  type Category {
    id: ID!
    name: String!
  }

  type BlogPost {
    id: ID!
    title: String!
    content: String!
    image_url: String
    created_at: DateTime!
    updated_at: DateTime!
    author: User!
    category: Category
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input PostInput {
    title: String!
    content: String!
    image_url: String
    category_id: ID
  }

  input PostUpdateInput {
    title: String
    content: String
    image_url: String
    category_id: ID
  }

  type Query {
    health: String!
    me: User
    posts(keyword: String, category_id: ID): [BlogPost!]!
    post(id: ID!): BlogPost
    categories: [Category!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!

    createPost(input: PostInput!): BlogPost!
    updatePost(id: ID!, input: PostUpdateInput!): BlogPost!
    deletePost(id: ID!): Boolean!

    createCategory(name: String!): Category!
  }
`;

module.exports = { typeDefs };

