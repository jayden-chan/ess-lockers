const nodemailer = require('nodemailer');

let smtpConfig = {
    host: 'ess.uvic.ca',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: 'ess',
        pass: 'alpha2omega'
    }
};

let transporter = nodemailer.createTransport(smtpConfig)

let mailOptions = {
        from: '"Fred Foo" <ess@ess.uvic.ca>', // sender address
        to: 'jaydencn7@gmail.com', // list of receivers
        subject: 'Hello', // Subject line
        text: 'This is a testing email', // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
