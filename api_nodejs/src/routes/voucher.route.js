const express = require('express');
const { checkAdmin } = require('../middlewares/authorization');
const {
  getAllVoucher,
  getVoucher,
  addVoucher,
  updateVoucher,
  deleteVoucher,
} = require('../controllers/voucher.controller');
const router = express.Router();

router.get('/', getAllVoucher);
router.get('/:id', getVoucher);
router.post('/', checkAdmin, addVoucher);
router.patch('/:id', checkAdmin, updateVoucher);
router.delete('/:id', checkAdmin, deleteVoucher);

module.exports = router;
