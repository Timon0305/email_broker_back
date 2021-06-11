const express = require('express');
const router = express.Router();
const cors = require('cors');

const {
  getQuote,
  createQuote,
    addQuote,
  fileUpload,
    checkPasscode
} = require('../Controllers/customer');

router
    .route('/getQuote')
    .get(getQuote);
router
  .route('/createQuote')
  .post(createQuote);
router
    .route('/addQuote')
    .post(addQuote)
router
    .route('/uploadFile')
    .post(fileUpload)
router
    .route('/checkPasscode')
    .get(checkPasscode)

module.exports = router;


