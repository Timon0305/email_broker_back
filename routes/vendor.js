const express = require('express');
const router = express.Router();

const {
    getBid,
    submitQuote
}  = require('../Controllers/vendor');

router
    .route('/getBid')
    .get(getBid)
router
    .route('/submitQuote')
    .post(submitQuote)

module.exports = router;