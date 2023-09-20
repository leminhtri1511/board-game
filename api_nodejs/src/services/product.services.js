const logger = require('../utils/logger');
const AxiosClient = require('./AxiosClient');

async function servGetAllProduct() {
  try {
    const url = 'api/v1/Products';
    const res = await AxiosClient.get(url);
    return res;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
async function servGetProduct(id) {
  try {
    const url = `api/v1/Product/${id}`;
    const res = await AxiosClient.get(url);
    return res;
  } catch (err) {
    throw err;
  }
}

async function servAddProduct() {}

async function servDeleteProduct(id) {
  try {
    const url = `api/v1/Product?productId=${id}`;
    const res = await AxiosClient.delete(url);
    return res;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  servGetAllProduct,
  servGetProduct,
  servAddProduct,
  servDeleteProduct,
};
