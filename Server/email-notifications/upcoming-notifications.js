
async function upcoming_notif(){
    //upcoming grades email notification
    //this should be run automatically 1-2 times a week
    console.log('Sending upcoming grade notifications emails...')

    const api_auth_token = "46b03d09-207a-4f2d-9796-4a5f31c642a7"

    var postmark = require("postmark");
    var client = new postmark.ServerClient(api_auth_token);
    const upg_email = "mjr076@shsu.edu" //will have to use an shsu.edu email as source for upGrade

    email = "" //must loop for each user to send each a personal email

    //to send email:
    client.sendEmailWithTemplate({
        "From": upg_email,
        "To": email,
        "TemplateAlias": "",
        "TemplateModel": {

        }
    })
};

module.exports = upcoming_notif