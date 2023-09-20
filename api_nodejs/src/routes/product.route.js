const express = require('express');
const {
  getAllProduct,
  deleteProduct,
  getProduct,
} = require('../controllers/product.controller');
const router = express.Router();

router.get('/', getAllProduct);
router.get('/:id', getProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
