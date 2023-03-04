

function reset_password(email){
    //triggered by reset password dialog
    //Run this after the email has been verified to exist

    var postmark = require("postmark");
    // Example request
    var client = new postmark.ServerClient("46b03d09-207a-4f2d-9796-4a5f31c642a7");

    client.sendEmail({
        "From": "upGrade",
        "To": email,
        "Subject": "Test",
        "TextBody": "Hello from Postmark!"
    });
}


function upcoming_notif(){
    //upcoming grades email notification
    //this should be run automatically 1-2 times a week
}