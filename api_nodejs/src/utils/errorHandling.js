const CustomError = require('../class/customError');

module.exports = function errorHandling(error, res) {
  if (error instanceof CustomError) {
    switch (error.code) {
      case 1:
        return res.status(error.statusCode).json({
          code: error.code,
          error: 'data_not_valid',
          message: error.message,
        });
      case 2:
        return res.status(error.statusCode).json({
          code: error.code,
          error: 'data_is_exist',
          message: error.message,
        });
      case 3:
        return res.status(error.statusCode).json({
          code: error.code,
          error: 'not_authentication',
          message: error.message,
        });
      case 4:
        return res.status(error.statusCode).json({
          code: error.code,
          error: 'not_authorization',
          message: error.message,
        });
      case 5:
        return res.status(error.statusCode).json({
          code: error.code,
          error: 'auth_error',
          message: error.message,
        });
      case 6:
        return res.status(error.statusCode).json({
          code: error.code,
          error: 'data_not_exists',
          message: error.message,
        });
      case 7:
        return res.status(error.statusCode).json({
          code: error.code,
          error: 'action_is_denied',
          message: error.message,
        });
      default:
        return res.status(error.statusCode).json({
          code: error.code,
          error: 'server_error',
          message: error.message,
        });
    }
  } else {
    return res.status(500).json({
      code: 9,
      error: 'server_error',
      message: 'Error from server ' + error,
    });
  }
};
