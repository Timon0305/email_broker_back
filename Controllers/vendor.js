const CustomerSchema = require('../Models/Customer');
const VendorSchema = require('../Models/Vendor');
const InviteSchema = require('../Models/Invite');

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

exports.getAllVendors = async (req, res) => {
    const passcode = req.query.pass;
    let key = req.query.key;
    let data;
    try {
        if (key === '') {
            data = await CustomerSchema.find({passcode: {$ne: passcode}});
        } else {
            data = await CustomerSchema.find({passcode: {$ne: passcode}}).find({email: {"$regex": key, "$options": "i"}});
        }
        res.send({
            data
        })
    } catch (e) {
        res.status(500).send();
    }
};

exports.getInvitedVendor = async (req, res) => {
    const passcode = req.query.pass;
    let invitedData = [];
    try {
        let data = await InviteSchema.find({creator: passcode});
        for (let item of data) {
            const vendor = await CustomerSchema.findOne({passcode: item.vendor});
            invitedData.push(vendor)
        }
        res.status(200).send({
            invitedData
        })
    } catch (e) {
        res.status(500).send()
    }
}

exports.inviteVendor = async (req, res) => {
    let {creator, vendor} = req.body;
    try {
        let searchInvite = await InviteSchema.find({creator: creator, vendor: vendor});
        if (searchInvite && searchInvite.length > 0) {
            res.status(200).send({
                success: false,
                msg: 'This vendor was already invited'
            })
        } else {
            const invite = new InviteSchema({creator, vendor})
            invite.save().then(data => {
                res.status(200).send({
                    success: true,
                    data: data,
                    msg: 'Successfully Invited'
                })
            })
        }
    } catch (e) {
        res.status(500).send();
    }
};

exports.deleteVendor = async (req, res) => {
    const {creator, vendor} = req.query;
    try {
        InviteSchema.remove({creator: creator, vendor: vendor}, (err, data) => {
            if (err) {
                res.status(500).send({
                    success: false
                })
            } else {
                res.status(200).send({
                    success: true,
                    data: data,
                    msg: 'Successfully Removed'
                })
            }
        });

    } catch (e) {
        res.status(500).send();
    }


}