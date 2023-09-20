const sql = require('mssql');
const query = require('../models/query');
const CustomError = require('../class/customError');
const { feedbackSchema } = require('../utils/validation');
const logger = require('../utils/logger');
const { getPathImgUpload } = require('../utils/utils');

async function getAllFeedBack(req, res, next) {
  try {
    await sql.query(query.qGetAllFeedback());
  } catch (err) {
    next(err);
  }
}

// Username, ava, star, comment, date, images,
async function getFeedBack(req, res, next) {
  // const
}

async function addFeedBack(req, res, next) {
  const validate = feedbackSchema.validate(req.body);
  if (validate.error)
    return next(
      new CustomError(1, 400, 'Feedback data is not valid ' + validate.error)
    );
  const { orderId, productId, stars, comment } = req.body;
  const listImage = req.files;
  try {
    // thieu check status order
    const findOrderDetail = await sql.query(
      query.qGetOrderDetail(orderId, productId)
    );
    if (findOrderDetail.recordset.length == 0)
      return next(new CustomError(6, 400, 'Product or Order not exists'));
    const findFeedback = await sql.query(
      query.qGetFeedBackByProductAndOrder(orderId, productId)
    );
    if (findFeedback.recordset.length > 0)
      return next(new CustomError(2, 400, 'Cannot feedback again'));
    const newFeedback = await sql.query(
      query.qAddFeedback(orderId, productId, stars, comment)
    );
    const newFeedbackId = newFeedback.recordset[0].ID;

    if (listImage) {
      listImage.forEach(async (item) => {
        await sql.query(
          query.qAddImageFeedback(newFeedbackId, getPathImgUpload(item.path))
        );
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Add new feedback success',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllFeedBack, getFeedBack, addFeedBack };
