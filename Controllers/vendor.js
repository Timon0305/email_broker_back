const CustomerSchema = require('../Models/Customer');

exports.getBid = (req, res) => {
    const passcode = req.query.pass;
    CustomerSchema.find({passcode: {$ne: passcode}}).then(data => {
        res.send({
            data
        })
    })
}