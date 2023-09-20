const express = require('express');
const { checkAdmin, jwtAuth } = require('../middlewares/authorization');
const {
  getAllCategory,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const router = express.Router();

router.get('/', getAllCategory);
router.get('/:id', getCategory);
router.use(jwtAuth);
router.use(checkAdmin);
router.post('/', addCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
