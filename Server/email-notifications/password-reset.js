
async function reset_password(email) {
    //triggered by reset password dialog
    //Run this after the email has been verified to exist
    //this might need to be frontend after all

    var postmark = require("postmark");
    // Example request
    var client = new postmark.ServerClient("46b03d09-207a-4f2d-9796-4a5f31c642a7");

    email = "mjr076@shsu.edu"
    const upg_email = "mjr076@shsu.edu"

    console.log('Sending reset link to '+email)

    //to send email:
    /*client.sendEmail({
        "From": upg_email,
        "To": email,
        "Subject": "Test",
        "TextBody": "Hello from Postmark!"
    });*/

};

module.exports = reset_password