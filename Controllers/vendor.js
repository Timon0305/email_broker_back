const CustomerSchema = require('../Models/Customer');
const VendorSchema = require('../Models/Vendor');
const InviteSchema = require('../Models/Invite');
const ItemSchema = require('../Models/Item');

exports.getBid = async (req, res) => {
    const passcode = req.query.pass;
    try {
        let myData = await CustomerSchema.find({passcode: passcode})
        let data = await ItemSchema.find({passcode: {$ne: passcode}});
        for (let item of data) {
            const vendor = await VendorSchema.findOne({creatorId: item._id, vendorPasscode: passcode});
            if (vendor) {
                item.price = vendor.price
            }
        }
        res.send({
            data,
            myData
        })
    } catch (e) {
        res.status(500).send();
    }
};

exports.submitQuote = async (req, res) => {
    let {formData, passcode} = req.body;
    try {
        for (let item of formData) {
            let vendorItem = await VendorSchema.findOne({vendorPasscode: passcode, creatorId: item._id});
            if (vendorItem) {
                vendorItem.price = Number(item.price);
               await vendorItem.save();
            } else {
                let newItem = new VendorSchema({
                    creatorId: item._id,
                    vendorPasscode: passcode,
                    price: Number(item.price)
                });
               await  newItem.save();
            }
        }
        res.status(200).send({
            success: true,
            msg: 'Successfully Submitted'
        })
    } catch (e) {
        console.log(e.message);
        res.status(500).send();
    }

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
