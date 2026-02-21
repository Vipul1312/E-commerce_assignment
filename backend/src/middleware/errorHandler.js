const errorHandler = (err, req, res, next) => {
  let message = err.message || 'Server Error';
  let status = err.statusCode || 500;

  if (err.name === 'CastError') { message = 'Resource not found'; status = 404; }
  if (err.code === 11000) { message = `${Object.keys(err.keyValue)[0]} already exists`; status = 400; }
  if (err.name === 'ValidationError') { message = Object.values(err.errors).map(e => e.message).join(', '); status = 400; }

  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
