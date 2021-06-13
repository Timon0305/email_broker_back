const CustomerSchema = require('../Models/Customer');
const VendorSchema = require('../Models/Vendor');

exports.getBid = async (req, res) => {
    const passcode = req.query.pass;
    try {
        let data = await CustomerSchema.find({passcode: {$ne: passcode}});
        for (let item of data) {
            const vendor = await VendorSchema.findOne({creatorId: item._id});
            if (vendor) {
                item.price = vendor.price
            }
        }
        res.send({
            data
        })

    } catch (e) {
        res.status(500).send();
    }
};

exports.submitQuote = (req, res) => {
    let {creatorId, creatorPasscode, vendorPasscode, price} = req.body.formData;
    console.log(creatorId, creatorPasscode, vendorPasscode)
    VendorSchema.findOne({
        creatorId: creatorId,
        creatorPasscode: creatorPasscode,
        vendorPasscode: vendorPasscode
    }, (err, data) => {
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