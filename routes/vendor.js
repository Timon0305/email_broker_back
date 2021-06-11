const express = require('express');
const router = express.Router();

const {
    getBid
}  = require('../Controllers/vendor');

router
    .route('/getBid')
    .get(getBid)

module.exports = router;