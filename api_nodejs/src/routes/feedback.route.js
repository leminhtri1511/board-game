const express = require('express');
const multer = require('multer');
const {
  getAllFeedBack,
  addFeedBack,
} = require('../controllers/feedback.controller');
const upload = multer({ dest: 'public/upload' });

const router = express.Router();
router.get('/', getAllFeedBack);
router.post('/', upload.array('listImage[]', 10), addFeedBack);

module.exports = router;
