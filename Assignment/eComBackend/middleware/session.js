const crypto = require('crypto');

function sessionId(req, res, next) {
  const header = req.header('x-session-id');
  req.sessionId = header && header.trim() ? header.trim() : crypto.randomUUID();
  res.setHeader('x-session-id', req.sessionId);
  next();
}

module.exports = { sessionId };
