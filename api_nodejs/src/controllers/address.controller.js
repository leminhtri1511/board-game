const sql = require('mssql');
const CustomError = require('../class/customError');
const query = require('../models/query');
const { addressSchema, addressUpdateSchema } = require('../utils/validation');
async function getListAddress(req, res, next) {
  const { userId } = req.params;
  try {
    const listAddr = await sql.query(query.qGetListAddrByUserId(userId));
    return res.status(200).json({
      success: true,
      message: 'Get list address success',
      data: {
        address: listAddr.recordset,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function addAddress(req, res, next) {
  const validate = addressSchema.validate(req.body);
  if (validate.error) {
    next(
      new CustomError(1, 400, 'Address info is not valid. ' + validate.error)
    );
  } else {
    const { userId } = req.params;
    const { fullName, phone, address, isDefault } = req.body;
    try {
      const newAddr = await sql.query(
        query.qAddAddress(userId, fullName, phone, address, isDefault)
      );
      if (isDefault == '1') {
        await sql.query(
          query.qSetAddressDefaultToFalseExceptId(
            userId,
            newAddr.recordset[0].ID
          )
        );
      }
      return res.status(200).json({
        success: true,
        message: 'Add address success',
        data: {
          id: newAddr.recordset[0].ID,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

async function updateAddress(req, res, next) {
  const validate = addressUpdateSchema.validate(req.body);
  if (validate.error) {
    next(
      new CustomError(1, 400, 'Address info is not valid. ' + validate.error)
    );
  } else {
    try {
      const { fullName, phone, address, isDefault } = req.body;
      const { userId, id } = req.params;
      const addressItem = await sql.query(query.qGetAddressById(id));
      if (addressItem.recordsets.length == 0)
        return next(new CustomError(6, 400, 'Address is not exists'));
      await sql.query(
        query.qUpdateAddress(id, fullName, phone, address, isDefault)
      );
      if (isDefault == '1') {
        await sql.query(query.qSetAddressDefaultToFalseExceptId(userId, id));
      }
      return res.status(200).json({
        success: true,
        message: 'Update address success',
      });
    } catch (err) {
      next(err);
    }
  }
}

async function deleteAddress(req, res, next) {
  const { id } = req.params;
  try {
    const addressItem = await sql.query(query.qGetAddressById(id));
    if (addressItem.recordsets.length == 0)
      return next(new CustomError(6, 400, 'Address is not exists'));
    if (addressItem.recordset[0].IsDefault == 1)
      return next(new CustomError(7, 400, 'Address can not be deleted'));
    await sql.query(query.qDeleteAddress(id));
    return res.status(200).json({
      success: true,
      message: 'Delete address success',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getListAddress, addAddress, updateAddress, deleteAddress };
