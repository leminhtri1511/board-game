const sql = require('mssql');
const CustomError = require('../class/customError');
const query = require('../models/query');
const logger = require('../utils/logger');
const { voucherSchema, voucherUpdateSchema } = require('../utils/validation');
async function getAllVoucher(req, res, next) {
  const { page, pageSize, status } = req.query;
  try {
    const listVoucher = await sql.query(
      query.qGetAllVoucher(page, pageSize, status)
    );
    res.status(200).json({
      success: true,
      message: 'Success get all voucher info',
      data: {
        count: listVoucher.recordset.length,
        voucher: listVoucher.recordset,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getVoucher(req, res, next) {
  const { id } = req.params;
  try {
    const voucher = await sql.query(query.qFindVoucherById(id));
    if (voucher.recordset.length == 0)
      return next(new CustomError(6, 400, 'Voucher not exists'));
    if (req.user.user.role == 0) {
      if (
        voucher.recordset[0].Amount <= 0 ||
        Date.parse(voucher.recordset[0].Expired) < Date.now()
      ) {
        return next(new CustomError(6, 400, 'Voucher is invalid'));
      }
    }
    return res.status(200).json({
      success: true,
      message: 'Get voucher info success',
      data: {
        voucher: voucher.recordset[0],
      },
    });
  } catch (err) {
    next(err);
  }
}

async function addVoucher(req, res, next) {
  const validate = voucherSchema.validate(req.body);
  if (validate.error) {
    return next(new CustomError(1, 400, 'Data voucher not valid'));
  } else {
    const { code, expired, amount, value } = req.body;
    const createBy = req.user.user.id;
    try {
      const findVoucher = await sql.query(query.qFindVoucherByCode(code));
      if (findVoucher.recordset.length != 0) {
        return next(new CustomError(2, 400, 'Voucher is exists'));
      }
      const findUser = await sql.query(query.qFindUserById(createBy));
      if (findUser.recordset.length == 0) {
        return next(new CustomError(6, 400, 'UserId (createBy) is not exists'));
      }
      const newVoucher = await sql.query(
        query.qAddVoucher(code, expired, amount, value, createBy)
      );
      return res.status(200).json({
        success: true,
        message: 'Add voucher successful',
        data: {
          voucher: { id: newVoucher.recordset[0].ID },
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

async function updateVoucher(req, res, next) {
  const { id } = req.params;
  const validate = voucherUpdateSchema.validate(req.body);
  if (validate.error) {
    return next(new CustomError(1, 400, 'Data voucher not valid'));
  } else {
    const { status, value, amount, expired, type } = req.body;
    const updateBy = req.user.user.id;
    try {
      const findVoucher = await sql.query(query.qFindVoucherById(id));
      if (findVoucher.recordset.length == 0) {
        return next(new CustomError(6, 400, 'Voucher is not exists'));
      }
      await sql.query(
        query.qUpdateVoucher(id, status, value, amount, expired, type, updateBy)
      );
      return res.status(200).json({
        success: true,
        message: 'Update voucher successful',
      });
    } catch (err) {
      next(err);
    }
  }
}

async function deleteVoucher(req, res, next) {
  const { id } = req.params;
  try {
    const findVoucher = await sql.query(query.qFindVoucherById(id));
    if (findVoucher.recordset.length == 0)
      return next(new CustomError(6, 400, 'Voucher is not exists'));
    await sql.query(query.qDeleteVoucher(id));
    return res.status(200).json({
      success: true,
      message: 'Delete voucher successful',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllVoucher,
  getVoucher,
  addVoucher,
  updateVoucher,
  deleteVoucher,
};
