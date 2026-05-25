const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function parseToken(authHeader) {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (_) {
    return null;
  }
}

function buildContext(req) {
  const user = parseToken(req.headers.authorization || '');
  return { user, req };
}

module.exports = { buildContext };

