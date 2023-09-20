const jwt = require('jsonwebtoken');
const sql = require('mssql');
const CustomError = require('../class/customError');
const query = require('../models/query');
const logger = require('../utils/logger');

async function jwtAuth(req, res, next) {
  let token = req.get('Authorization');
  if (!token) {
    next(new CustomError(3, 401, 'Auth error'));
  } else {
    token = token.replace('Bearer ', '');
    try {
      const decode = jwt.verify(token, process.env.PRIVATE_KEY);
      const findUser = await sql.query(query.qFindUser(decode.user.username));
      if (findUser.recordset.length == 0)
        throw new CustomError(3, 401, 'Auth error');
      else req.user = decode;
      next();
    } catch (err) {
      next(err);
    }
  }
}

function checkAdmin(req, res, next) {
  if (!req.user) next(new CustomError(3, 401, 'Auth Error'));
  if (!req.user.user.role) next(new CustomError(4, 401, 'Authorization error'));
  next();
}

module.exports = { jwtAuth, checkAdmin };
