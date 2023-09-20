const sql = require('mssql');
const CustomError = require('../class/customError');
const query = require('../models/query');
const logger = require('../utils/logger');
const { getPathImgUpload } = require('../utils/utils');

exports.getAllUser = async (req, res, next) => {
  const { page, pageSize } = req.body;
  try {
    const listUser = await sql.query(query.qFindAllUser(page, pageSize));
    res.status(200).json({
      success: true,
      message: 'Success get all user info',
      data: { count: listUser.recordset.length, users: listUser.recordset },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await sql.query(query.qFindUserById(id));
    if (user.recordset.length == 0)
      next(new CustomError(6, 400, 'User not exists'));
    const listAddress = await sql.query(query.qFindListAddrByUserId(id));
    const resData = {
      ...user.recordset[0],
      listAddress: listAddress.recordset,
    };
    delete resData['Password'];
    delete resData['Role'];
    delete resData['IsDelete'];
    delete resData['isLock'];
    delete resData['CreatedBy'];
    delete resData['UpdatedBy'];
    res
      .status(200)
      .json({ success: true, message: 'Get data user success', data: resData });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const { isLock } = req.body;
  const { id } = req.params;
  const user = await sql.query(query.qFindUserById(id));
  if (user.recordset.length == 0)
    next(new CustomError(6, 400, 'User not exists'));
  if (isLock) {
    const result = await sql.query(query.qLockUser(id));
    return res.json({ data: result });
  } else {
    const { fullName, phone, dob, gender, email } = req.body;
    const avatar = req.file;
    let avatarPath;
    if (!avatar) avatarPath = null;
    else avatarPath = getPathImgUpload(avatar.path);
    const result = await sql.query(
      query.qUpdateUser(id, fullName, phone, dob, gender, email, avatarPath)
    );
    return res.json({
      success: true,
      message: 'Update user success',
      data: { users: result.recordset, avatarPath: avatarPath },
    });
    // return res.send('ok');
  }
};

// Date,status,gia tien,san pham [{ten, anh, price, amount, }]
exports.getOrderOfUser = async (req, res, next) => {
  const { id } = req.params;
  let { type, page, pageSize } = req.query;
  if (!type) type = 'NULL';
  try {
    const user = await sql.query(query.qFindUserById(id));
    if (user.recordset.length == 0)
      return next(new CustomError(6, 400, 'User not exists'));
    const listOrder = await sql.query(
      query.qGetAllOrderOfUser(id, page, pageSize, type)
    );
    const resData = listOrder.recordset;
    if (listOrder.recordset.length > 0) {
      for (let i = 0; i < listOrder.recordset.length; i++) {
        const product = await sql.query(
          query.qGetOrderProduct(listOrder.recordset[i].Id)
        );
        resData[i]['products'] = product.recordset;
      }
    }
    return res.status(200).json({
      success: true,
      message: 'Get list order success',
      data: {
        orders: resData,
      },
    });
    // const
  } catch (err) {
    next(err);
  }
};
