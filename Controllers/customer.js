const CustomerSchema = require('../Models/Customer');
const VendorSchema = require('../Models/Vendor');
const ItemSchema = require('../Models/Item');


exports.getQuote = (req, res) => {
    const passcode = req.query.passcode;
    CustomerSchema.find({passcode: passcode}).then(data => {
        res.send({
            data
        })
    })
};

exports.createQuote = async (req, res) => {
    try {
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        const lengthOfCode = 6;
        let {email, title, description, attachment, items} = req.body
        let passcode = makeRandom(lengthOfCode, possible);
        let customer = await CustomerSchema.findOne({passcode: passcode});
        if (customer) {
            res.send({
                success: false,
                msg: 'Passcode is already existed'
            })
        } else {
            customer = new CustomerSchema({email, title, description, passcode, attachment});
            await customer.save();

            for (let it of items) {
                let _item = new ItemSchema({
                    name: it.itemName,
                    description: it.itemDescription,
                    passcode: passcode,
                    quantity: it.itemQuantity,
                    unit: it.itemUnit
                });
                await _item.save();
            }
            res.send({
                success: true,
                msg: 'Successfully created',
                data: customer,
            });
        }
    } catch (e) {
        console.log('ex:', e.message);

    }
}

exports.addQuote = (req, res) => {
    let {email, title, description, quantity, unit, attachment} = req.body.quoteInfo
    let passcode = req.body.passcode;
    const customer = new CustomerSchema({email, title, description, quantity, unit, passcode, attachment})
    customer.save().then(data => {
        res.send({
            success: true,
            data: data,
            msg: 'Successfully Created'
        })
    }).catch(err => console.log(err))
}

function makeRandom(lengthOfCode, possible) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

exports.fileUpload = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const id = req.files.file.name.split('.')[0];
    CustomerSchema.findOne({_id: id}, (err, user) => {
        user.attachment = req.files.file.name;
        user.save();
    })
    if (req.files.file) {
        let path = __dirname + '/../public/' + req.files.file.name;

        req.files.file.mv(path, (err) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send({success: true})
        })
    }
}

exports.checkPasscode = (req, res) => {
    const passcode = req.query.pass;
    CustomerSchema.findOne({passcode: passcode}, (err, data) => {
        if (data) {
            res.send({
                success: true,
                msg: 'Successfully Redirected',
                passcode
            })
        } else {
            res.send({
                success: false,
                msg: 'Invalid Passcode'
            })
        }
    })
};

exports.getMyQuote = async (req, res) => {
    let passcode = req.query.pass;
    let data = [];
    try {
        let myQuote = await ItemSchema.find({passcode: passcode});
        for (let item of myQuote) {
            let _subItem = {};
            _subItem.title = item.name;
            _subItem.quantity = item.quantity;
            let others = await CustomerSchema.find({passcode: {$ne: passcode}}).sort('passcode');
            let subData = [];
            for (let _idOther = 0; _idOther < others.length; _idOther++) {

                let vendor = await VendorSchema.findOne({
                    creatorId: item._id,
                    vendorPasscode: others[_idOther].passcode
                })
                let _subVendor = {
                    name: 'vendor' + (_idOther + 1)
                };
                if (vendor) {
                    _subVendor.price = vendor.price;
                    _subVendor.vendor = vendor.vendorPasscode;
                    _subVendor.calPrice = vendor.price * parseInt(item.quantity)
                } else {
                    _subVendor.calPrice = 'NaN'
                }
                subData.push(_subVendor)
            }
            _subItem.vendor = subData

            data.push(_subItem)
        }
        let lowPrice = [];
        let minCountData = {};
        for (let vendor of data[0].vendor) {
            minCountData[vendor.name] = 0;
        }
        for (let product of data) {
            let min = 99999999999999999999999;
            for (let vendor of product.vendor) {
                if (vendor.price < min) {
                    min = vendor.price;
                }
            }

            let minVendor = product.vendor.find(e => e.price === min);
            if (minVendor) {
                minCountData[minVendor.name]++;
            }
        }
        for (let key in minCountData) {
            lowPrice.push({
                name: key,
                count: minCountData[key]
            })
        }
        res.status(200).send({
            data,
            lowPrice
        })
    } catch (e) {
        console.log('Exception ', e.message);
        res.status(500).send()
    }

}
