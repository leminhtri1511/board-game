const sql = require('mssql');
const jwt = require('jsonwebtoken');
const query = require('../models/query');
const CustomError = require('../class/customError');

// List Product(mainImg, subScr, name, price), countAll
async function getAllProduct(req, res, next) {
  const { category, filter, key, page, pageSize } = req.query;
  let isAdmin;
  if (!req.get('Authorization')) isAdmin = false;
  else {
    let token = req.get('Authorization');
    token = token.replace('Bearer ', '');
    const decode = jwt.verify(token, process.env.PRIVATE_KEY);
    if (decode.user.role == 1) {
      isAdmin = true;
    } else isAdmin = false;
  }
  if (!isAdmin) {
    try {
      const listProduct = await sql.query(
        query.qGetAllProduct(category, filter, key, page, pageSize)
      );
      let totalCount;
      const resCount = await sql.query(query.qCountProduct(category, key));
      if (resCount.recordset.length > 0)
        totalCount = resCount.recordset[0].CountProduct;
      else totalCount = 0;
      res.status(200).json({
        success: true,
        message: 'Get all product success',
        data: {
          count: totalCount,
          products: listProduct.recordset,
        },
      });
    } catch (err) {
      next(err);
    }
  } else {
    // name, nguon goc, gia ban, amount, ten loai,
    const listProduct = await sql.query(
      query.qGetAllProductAdmin(category, filter, key, page, pageSize)
    );
    res.status(200).json({
      success: true,
      message: 'Get all product success',
      data: {
        products: listProduct.recordset,
      },
    });
  }
}

//list image, đánh giá, số lượng tối đa,
async function getProduct(req, res, next) {
  const { id } = req.params;
  try {
    const product = await sql.query(query.qGetProductById(id));
    if (product.recordset.length == 0)
      return next(new CustomError(6, 400, 'Product is not exists'));
    const listProductImage = await sql.query(query.qGetProductImage(id));
    const listCategory = await sql.query(query.qGetProductCategory(id));
    const listFeedback = await sql.query(query.qGetAllFeedbackProduct(id));
    const resData = {
      ...product.recordset[0],
      images: listProductImage.recordset,
      categories: listCategory.recordset,
      feedback: listFeedback.recordset,
    };
    if (listFeedback.recordset.length > 0) {
      for (let i = 0; i < listFeedback.recordset.length; i++) {
        const feedbackImages = await sql.query(
          query.qGetFeedbackImage(listFeedback.recordset[i].Id)
        );
        resData.feedback[i].images = feedbackImages.recordset;
      }
    }
    return res.status(200).json({
      success: true,
      message: 'Get data product success',
      data: { product: resData },
    });
  } catch (err) {
    next(err);
  }
}

async function addProduct(req, res, next) {
  const {
    name,
    weight,
    time,
    size,
    shortDesc,
    playersSuggest,
    players,
    origin,
    mainImage,
    description,
    categoryId,
    brand,
    amount,
    ageSuggest,
  } = req.body;
  try {
    const findProduct = await sql.query(query.qGetProductByName(name));
    if (findProduct.recordset.length > 0)
      return next(new CustomError(6, 400, 'Product is exists'));
    await sql.query(
      query.qAddProduct(
        name,
        weight,
        time,
        size,
        shortDesc,
        playersSuggest,
        players,
        origin,
        mainImage,
        description,
        categoryId,
        brand,
        amount,
        ageSuggest
      )
    );
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {}

async function deleteProduct(req, res, next) {
  const { id } = req.params;
  try {
    const findProduct = await sql.query(query.qGetProductById(id));
    if (findProduct.recordset.length == 0)
      return new CustomError(6, 400, 'Product is not exists');
    await sql.query(query.qDeleteProduct(id));
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllProduct, getProduct, addProduct, deleteProduct };
