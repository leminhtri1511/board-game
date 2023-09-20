const express = require('express');
const { jwtAuth } = require('../middlewares/authorization');
const {
  signIn,
  signUp,
  changePass,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.patch('/changepass', jwtAuth, changePass);

module.exports = router;
