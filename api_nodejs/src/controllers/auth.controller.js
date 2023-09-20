const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const CustomError = require('../class/customError');
const logger = require('../utils/logger');
const query = require('../models/query');

const {
  signInSchema,
  signUpSchema,
  changePassSchema,
} = require('../utils/validation');

async function signIn(req, res, next) {
  const validate = signInSchema.validate(req.body);
  if (validate.error) {
    next(new CustomError(1, 400, 'Username, Password not valid'));
  } else {
    const { username, password } = req.body;
    try {
      const findUser = await sql.query(query.qFindUserByUsername(username));
      if (findUser.recordset.length == 0) {
        throw new CustomError(6, 400, 'Username is not exists');
      }
      const checkPass = bcrypt.compareSync(
        password,
        findUser.recordset[0].Password
      );
      if (!checkPass && password != findUser.recordset[0].Password)
        throw new CustomError(3, 400, 'Username or password wrong');
      else {
        const cart = await sql.query(
          query.qGetCartByUserId(findUser.recordset[0].Id)
        );
        const cartId = await sql.query(
          query.qGetCartId(findUser.recordset[0].Id)
        );
        const resItem = {
          ...findUser.recordset[0],
          cardId: cartId.recordset[0].Id,
          cart: cart.recordset,
        };
        delete resItem['Password'];
        delete resItem['IsDelete'];
        delete resItem['isLock'];
        delete resItem['CreatedBy'];
        delete resItem['UpdatedBy'];
        const token = jwt.sign(
          {
            user: {
              id: resItem.Id,
              username: resItem.Username,
              email: resItem.Email,
              role: resItem.Role,
            },
          },
          process.env.PRIVATE_KEY,
          { expiresIn: '1h' }
        );
        res.json({
          success: true,
          message: 'SignIn successfull',
          data: { user: resItem, token: token },
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

async function signUp(req, res, next) {
  const validate = signUpSchema.validate(req.body);
  if (validate.error) {
    next(new CustomError(1, 400, 'Username, Email or Password not valid'));
  } else {
    const { username, password, email } = req.body;
    try {
      const findUser = await sql.query(query.qFindUser(username, email));
      if (findUser.recordset.length > 0) {
        throw new CustomError(2, 400, 'User is exists');
      }
      const encryptPass = await bcrypt.hash(password, 10);
      await sql.query(query.qSignUp(username, email, encryptPass));
      res.json({ success: true, message: 'Signup successful' });
    } catch (err) {
      next(err);
    }
  }
}

async function changePass(req, res, next) {
  const validate = changePassSchema.validate(req.body);
  if (validate.error) {
    next(new CustomError(1, 400, 'Password not valid'));
  } else {
    const { pass, newPass, confirmNewPass } = req.body;
    const id = req.user.user.id;
    if (newPass != confirmNewPass) {
      return next(new CustomError(1, 400, 'Data not valid'));
    }
    try {
      const findUser = await sql.query(query.qFindUserById(id));
      if (findUser.recordset.length == 0) {
        return next(new CustomError(6, 400, 'User is not exists'));
      }
      const checkPass = bcrypt.compareSync(
        pass,
        findUser.recordset[0].Password
      );
      if (!checkPass && pass != findUser.recordset[0].Password)
        return next(new CustomError(3, 400, 'Password wrong'));
      const encryptPass = await bcrypt.hash(newPass, 10);
      await sql.query(query.qChangePass(id, encryptPass));
      return res.status(200).json({
        success: true,
        message: 'Change pass success',
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { signIn, signUp, changePass };
