const nodeMailer = require('nodemailer')
const {mailList}= require('../../Model/user')

var transpoter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ravishnu60@gmail.com',
        pass: 'twadgolbsqljoazy'
    }
});

var mailOptions = {
    from: 'ravishnu60@gmail.com',
    to: 'ravishnu410@gmail.com',
    subject: 'Checking',
    text: 'Hello HI',
    attachments: [{
        filename: 'test.jpg',
        path: 'D:/Node/POC/projects/4/images/test.jpg', 
        cid: 'img1'
    }],
    html: 'Embedded image: <img src="cid:img1"/>',
};

const sendMail = (req, res) => {
    mailOptions.to=req.body.email;

    transpoter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            res.send("Can't Send Email.")
        } else {
            console.log('Email sent: ' + info.response);
            res.send("Mail sent")
        }
    })
}

const subscribe= (req,res)=>{
   res.send(req.body);
}

const unsubscribe= (req,res)=>{
    res.send(req.params);
}

const viewsubscriber= (req,res)=>{
    res.send("ok");
}
module.exports= {sendMail,subscribe,unsubscribe,viewsubscriber}