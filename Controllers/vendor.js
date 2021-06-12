const CustomerSchema = require('../Models/Customer');
const VendorSchema = require('../Models/Vendor');

exports.getBid = (req, res) => {
    const passcode = req.query.pass;
    CustomerSchema.find({passcode: {$ne: passcode}}).then(async data => {
        data.map(item => {
             VendorSchema.findOne({creatorId: item._id}, (err, vendor) => {
                if (vendor) {
                    item.price = vendor.price
                }
            })
        })
        setTimeout(() => {
            res.send({
                data
            })
        }, 4000)
    })
};

exports.submitQuote = (req, res) => {
    let {creatorId, creatorPasscode, vendorPasscode, price} = req.body.formData;
    console.log(creatorId, creatorPasscode, vendorPasscode)
    VendorSchema.findOne({creatorId: creatorId, creatorPasscode: creatorPasscode, vendorPasscode: vendorPasscode}, (err, data) => {
        try {
            if (data) {
                data.price = price;
                data.save();
                CustomerSchema.find({_id: creatorId, passcode: creatorPasscode}, (err, customer) => {
                    customer[0].price = price;
                    res.send({
                        success: true,
                        data: data,
                        msg: 'Successfully Edited'
                    })
                })
            } else {
                const vendor = new VendorSchema({creatorId, creatorPasscode, vendorPasscode, price});
                vendor.save();
                CustomerSchema.find({_id: creatorId, passcode: creatorPasscode}, (err, customer) => {
                    customer[0].price = price;
                    res.send({
                        success: true,
                        data: data,
                        msg: 'Successfully Submitted'
                    })
                })
            }

        } catch (e) {
            console.log(e)
        }
    })
}