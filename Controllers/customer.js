const CustomerSchema = require('../Models/Customer');

exports.getQuote = (req, res) => {
    const passcode = req.query.passcode;
    CustomerSchema.find({passcode: passcode}).then(data => {
        res.send({
            data
        })
    })
};

exports.createQuote = (req, res) => {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const lengthOfCode = 6;
    let {email, title, description, quantity, unit, attachment} = req.body
    let passcode = makeRandom(lengthOfCode, possible);
    CustomerSchema.findOne({passcode: passcode}).then(data => {
        if (data) {
            res.send({
                success: false,
                msg: 'Password is already existed'
            })
        } else {
            const customer = new CustomerSchema({email, title, description, quantity, unit, passcode, attachment})
            customer.save().then(data => {
                res.send({
                    success: true,
                    data: data,
                    msg: 'Successfully Created'
                })
            }).catch(err => console.log(err))
        }
    })
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
        let path = __dirname + '\\..\\public\\' + req.files.file.name;
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
}