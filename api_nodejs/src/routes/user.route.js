const express = require('express');
const multer = require('multer');
const { checkAdmin } = require('../middlewares/authorization');
const {
  getAllUser,
  getUser,
  updateUser,
  getOrderOfUser,
} = require('../controllers/user.controller');
const {
  getListAddress,
  addAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/address.controller');
const upload = multer({ dest: 'public/upload/avatar' });
const router = express.Router();

router.get('/', checkAdmin, getAllUser);
router.get('/:id', getUser);
router.get('/:id/orders', getOrderOfUser);
router.patch('/:id', upload.single('avatar'), updateUser);

// address
// localhost:3000/api/v1/users/:userId/address/:id
// Ex: DELETE localhost:3000/api/v1/users/5/address/7
router.get('/:userId/address', getListAddress);
router.post('/:userId/address', addAddress);
router.patch('/:userId/address/:id', updateAddress);
router.delete('/:userId/address/:id', deleteAddress);

module.exports = router;
