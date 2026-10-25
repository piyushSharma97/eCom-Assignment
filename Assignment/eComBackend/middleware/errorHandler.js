function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Server error',
  });
}

function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
