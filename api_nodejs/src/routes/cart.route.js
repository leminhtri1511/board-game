const express = require('express');

const {
  addCartItem,
  updateCartItem,
  deleteCartItem,
} = require('../controllers/cart.controller');

const router = express.Router();

router.post('/', addCartItem);
router.patch('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);

module.exports = router;
