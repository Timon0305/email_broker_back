const CustomerSchema = require('../Models/Customer');
const VendorSchema = require('../Models/Quote');

exports.getBid = (req, res) => {
    const passcode = req.query.pass;
    CustomerSchema.find({passcode: {$ne: passcode}}).then(data => {
        res.send({
            data
        })
    })
};

exports.submitQuote = (req, res) => {
    let {passcode, creatorId, price} = req.body.formData;
    VendorSchema.find({_id: creatorId}).then(data => {
        console.log(data)
    })
}