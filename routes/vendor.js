const express = require('express');
const router = express.Router();

const {
    getBid,
    submitQuote,
    getAllVendors,
    getInvitedVendor,
    inviteVendor,
    deleteVendor
}  = require('../Controllers/vendor');

router
    .route('/getBid')
    .get(getBid)
router
    .route('/submitQuote')
    .post(submitQuote)
router
    .route('/getAllVendors')
    .get(getAllVendors)
router
    .route('/getInvitedVendor')
    .get(getInvitedVendor)
router
    .route('/inviteVendor')
    .post(inviteVendor)
router
    .route('/deleteVendor')
    .delete(deleteVendor)
module.exports = router;