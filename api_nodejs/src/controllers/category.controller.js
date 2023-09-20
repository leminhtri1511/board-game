const sql = require('mssql');
const CustomError = require('../class/customError');
const query = require('../models/query');
async function getAllCategory(req, res, next) {
  try {
    const listCategory = await sql.query(query.qGetAllCategory());
    return res.status(200).json({
      success: true,
      message: 'Get all data category success',
      data: {
        categories: listCategory.recordset,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getCategory(req, res, next) {}

async function addCategory(req, res, next) {
  const { name } = req.body;
  try {
    const category = await sql.query(query.qGetCategoryByName(name));
    if (category.recordset.length > 0)
      return next(new CustomError(2, 400, 'Category name is exists'));
    await sql.query(query.qAddCategory(name));
    res.status(200).json({
      success: true,
      message: 'Add category success',
    });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  const { name } = req.body;
  const { id } = req.params;
  try {
    const findCategoryWithId = await sql.query(query.qGetCartegoryById(id));
    if (findCategoryWithId.recordset.length == 0)
      return next(new CustomError(6, 400, 'Category is not exists'));
    const findCategoryWithName = await sql.query(
      query.qGetCategoryByName(name)
    );
    if (findCategoryWithName.recordset.length > 0)
      return next(new CustomError(2, 400, 'Category name is exists'));
    await sql.query(query.qUpdateCategory(id, name));
    res.status(200).json({
      success: true,
      message: 'Update category success',
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  const { id } = req.params;
  try {
    const findCategoryWithId = await sql.query(query.qGetCartegoryById(id));
    if (findCategoryWithId.recordset.length == 0)
      return next(new CustomError(6, 400, 'Category is not exists'));
    await sql.query(query.qDeleteCategory(id));
    res.status(200).json({
      success: true,
      message: 'Delete category success',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCategory,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
