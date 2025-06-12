// utils/handleError.js
module.exports = function handleError(res, statusCode, message, backUrl = '/') {
  return res.status(statusCode).render('error', {
    code: statusCode,
    message,
    backUrl
  });
};
