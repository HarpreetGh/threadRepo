const router = require("express").Router();

router.route("/").post((req, res) => {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: 'orange101@mail.fresnostate.edu',
        from: 'threadRepo@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong> and easy to do anywhere, even with Node.js</strong>',
    }
    console.log(msg);

    sgMail
        .send(msg)
        .then(() => { console.log("Email sent") })
        .catch((error) => { console.log("error") })

});

router.route("/payment").post((req, res) => {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: req.body.email,
        from: 'threadRepo@gmail.com',
        subject: 'Your Listing has Sold',
        text: 'Your listing ' + req.body.name + ' has sold. Please send your package to user '
            + req.body.username + ".\n" + "The address is: " + req.body.address.line1 + " " +
            req.body.address.city + " " + req.body.address.state + " " + req.body.address.postal_code,
        //html: '<strong> and easy to do anywhere, even with Node.js</strong>',
    }
    console.log(msg);

    sgMail
        .send(msg)
        .then(() => { console.log("Email sent") })
        .catch((error) => { console.log("error") })

});

module.exports = router;

