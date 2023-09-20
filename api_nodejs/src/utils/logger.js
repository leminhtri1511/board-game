const winston = require('winston');
const path = require('path');

const prettyJson = winston.format.printf((info) => {
  if (info.message.constructor === Object) {
    info.message = JSON.stringify(info.message);
  }
  return `${info.level}: ${info.message}`;
});

module.exports = winston.createLogger({
  // format của log được kết hợp thông qua format.combine
  format: winston.format.combine(
    // Format object to json
    prettyJson,
    winston.format.label({
      label: path.basename(require?.main?.filename || ''),
    }),
    winston.format.metadata({
      fillExcept: ['message', 'level', 'timestamp', 'label'],
    }),
    // winston.format.json(),
    winston.format.splat(),
    // Định dạng time cho log
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    // thêm màu sắc
    winston.format.colorize(),
    // thiết lập định dạng của log
    winston.format.printf((log) => {
      // nếu log là error hiển thị stack trace còn không hiển thị message của log
      if (log.stack)
        return `[${log.timestamp}] [${log.level}] [${log.label}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] [${log.label}] ${log.message}`;
    })
  ),
  transports: [
    // hiển thị log thông qua console
    new winston.transports.Console(),
    // Thiết lập ghi các errors vào file
    new winston.transports.File({
      level: 'error',
      filename: path.join(__dirname, '../logs', 'errors.log'),
    }),
  ],
});
