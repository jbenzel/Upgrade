
async function reset_password(email) {
    //triggered by reset password dialog
    //Run this after the email has been verified to exist
    //this might need to be frontend after all
    const api_auth_token = "46b03d09-207a-4f2d-9796-4a5f31c642a7"
    var postmark = require("postmark");
    var client = new postmark.ServerClient(api_auth_token);

    email = "mjr076@shsu.edu" //temporary, email must be passed in
    const upg_email = "mjr076@shsu.edu" //will have to use an shsu.edu email as source for upGrade

    console.log('Sending reset link to '+email)

    //to send email:
    client.sendEmailWithTemplate({
        "From": upg_email,
        "To": email,
        "TemplateAlias": "password-reset",
        "TemplateModel": {
            "product_url": "",
            "product_name": "upGrade",
            "name": email,
            "auth_token": "[to be determined]",
            "action_url": "https://www.w3schools.com/", //URL To be determined, action_url must be filled to properly load the button in the email
            "company_name": "upGrade",
            "company_address": "",
            "operating_system": "",
            "browser_name": "",
            "support_url": ""
        }
    })

};

module.exports = reset_password