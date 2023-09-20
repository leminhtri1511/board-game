const sql = require('mssql');
const CustomError = require('../class/customError');
const query = require('../models/query');

async function addCartItem(req, res, next) {
  const { productId, amount } = req.body;
  const userId = req.user.user.id;
  try {
    const cart = await sql.query(query.qGetCartId(userId));
    if (cart.recordset.length == 0)
      return next(new CustomError(6, 400, 'Cart not exists'));
    const newCartItem = await sql.query(
      query.qAddCartItem(cart.recordset[0].Id, productId, amount)
    );
    return res.status(200).json({
      success: true,
      message: 'Add item to cart success',
      data: {
        cartProductId: newCartItem.recordset[0].ID,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function updateCartItem(req, res, next) {
  const { id } = req.params;
  const { amount } = req.body;
  const userID = req.user.user.id;
  try {
    const cartProduct = await sql.query(
      query.qGetCartProductByProductId(id, userID)
    );
    if (cartProduct.recordset.length == 0)
      return next(new CustomError(6, 400, 'Product not exists in Cart'));
    await sql.query(query.qUpdateCartItem(cartProduct.recordset[0].Id, amount));
    return res
      .status(200)
      .json({ success: true, message: 'Update cart item success' });
  } catch (err) {
    next(err);
  }
}

async function deleteCartItem(req, res, next) {
  const { id } = req.params;
  try {
    const cartProduct = await sql.query(query.qGetCartProductById(id));
    if (cartProduct.recordset.length == 0)
      return next(new CustomError(6, 400, 'Product not exists in Cart'));
    await sql.query(query.qDeleteCartProductById(id));
    return res
      .status(200)
      .json({ success: true, message: 'Delete cart item success' });
  } catch (err) {
    next(err);
  }
}

module.exports = { addCartItem, updateCartItem, deleteCartItem };
