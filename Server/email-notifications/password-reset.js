
async function reset_password(email) {
    //triggered by reset password dialog
    const { ApolloClient, InMemoryCache, createHttpLink, gql } = require("@apollo/client/core");
    const api_auth_token = "46b03d09-207a-4f2d-9796-4a5f31c642a7"
    var postmark = require("postmark");
    var client = new postmark.ServerClient(api_auth_token);
    const BackClient = new ApolloClient({
        link: createHttpLink({ uri: 'http://localhost:4000/graphql' }),
        cache: new InMemoryCache(),
    });

    const upg_email = "mjr076@shsu.edu" //will have to use an shsu.edu email as source for upGrade
    const reset_url = "http://localhost:4200/#/pass-reset" //link to reset page

    //check if token already exists, update. else, generate new token
    var user_token

    console.log('Sending reset link to '+email)

    //to send email:
    
    var response = client.sendEmailWithTemplate({
        "From": upg_email,
        "To": email,
        "TemplateAlias": "password-reset",
        "TemplateModel": {
            "product_url": "",
            "product_name": "upGrade",
            "name": email,
            "auth_token": user_token,
            "action_url": reset_url, //URL To be determined, action_url must be filled to properly load the button in the email
            "company_name": "upGrade",
            "company_address": "",
            "operating_system": "",
            "browser_name": "",
            "support_url": ""
        }
    })
    
    console.log("Error Code is: "+(await response).ErrorCode)
    return (await response)
    
};

module.exports = reset_password