const express = require('express');
const router = express.Router();
const cors = require('cors');

const {
  createQuote,
  fileUpload
} = require('../Controllers/customer');


router
  .route('/createQuote')
  .post(createQuote);

router
    .route('/uploadFile')
    .post(fileUpload)


module.exports = router;


