const express = require('express');
const router = express.Router();

const {
  getQuote,
  createQuote,
    addQuote,
  fileUpload,
    checkPasscode,
  getMyQuote,
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
    .route('/checkQuote')
    .get(checkPasscode)
router
    .route('/getMyQuote')
    .get(getMyQuote)
module.exports = router;


