const nodeMailer = require('nodemailer');
const { mailList } = require('../../Model/user');
const { subscribeSchema, mailSchema } = require('../../Schema/usersSchema');
const fs = require('fs');

var transpoter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ravishnu60@gmail.com',
        pass: 'twadgolbsqljoazy'
    },
    secure: true
});

const mailOptions = (data, files) => {
    var mailBody = {
        from: 'Node ravishnu60@gmail.com',
        to: data.mail_id,
        subject: data.subject,
        text: data.text
    }

    if (files != 0) {
        
        var html = `<h3>${data.text}</h3>`;
        var attachments = [];

        files.files.images.length==undefined && (files.files.images=[{...files.files.images}])
        const dataFile = files.files.images;
        var i = 0;
        for (const file of dataFile) {
            let temp = { filename: file.name, content:file.data, cid: `ci${i}` }
            attachments.push(temp);
            html= html.concat(`<img src="cid:ci${i}" style="height:150px;width:150px" /> `);
            i++;
        }
        mailBody.html=html
        mailBody.attachments = attachments;
    }
    return mailBody

};

const sendMail = (req, res) => {

    const { error, value } = mailSchema.validate(req.body);
    if (error) {
        return res.send(error.details[0].message);
    }

    var mailData;
    if (req.files) {
        mailData = mailOptions(value, req);
    } else {
        mailData = mailOptions(value, 0);
    }

    transpoter.sendMail(mailData, (err, info) => {
        if (err) {
            console.log(err);
            res.status(500).send("Can't Send Email")
        } else {
            console.log('Email sent: ' + info.response);
            res.send("Mail sent");
        }
    })
}

const subscribe = async (req, res) => {
    //validation
    const { error, value } = subscribeSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const check = await mailList.findOne({ where: { mail_id: value.mail_id } });

    if (check) {
        return res.send("Already subscribed");
    } else {
        const { err, data } = await mailList.create(value);
        if (err) throw err;
        return res.send("Subscribed successfully");
    }


}

const unsubscribe = async (req, res) => {
    //validation
    const { error, value } = subscribeSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const check = await mailList.findOne({ where: { mail_id: value.mail_id } });

    if (check) {
        mailList.destroy({ where: { mail_id: value.mail_id } })
        return res.send("Unsubscribed successfully");
    } else {
        res.send("You are not subscribed");
    }
}

const viewsubscriber = async (req, res) => {
    const data = await mailList.findAll({ attributes: ['mail_id'], order: [['id', 'desc']], })
    if (data) {
        return res.send(data)
    } else {
        return res.status(404).send("Data not found")
    }
}
module.exports = { sendMail, subscribe, unsubscribe, viewsubscriber }