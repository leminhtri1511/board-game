const mssql = require('mssql');
const logger = require('./logger');
const { sqlConfig } = require('../configs/default');

const connectDB = async () => {
  try {
    await mssql.connect(sqlConfig);
    logger.info('Connect DB success');
  } catch (error) {
    logger.error('Cannot connect DB', error);
  }
};

module.exports = connectDB;
