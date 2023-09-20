class CustomError extends Error {
  constructor(code, statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'CustomError';
  }
}

module.exports = CustomError;
