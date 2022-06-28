module.exports = (reason, statusCode) => {
  const error = new Error(reason);
  error.statusCode = statusCode;
  throw error;
};
