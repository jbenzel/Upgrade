
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

    const GET_USER_ID = gql`
    query ($emailParam: String) {
        getUserbyEmail(emailParam: $emailParam) {
          userID
        }
      }
    `;

    const MAKE_TOKEN = gql`
    mutation($userId: ID!) {
        createorUpdateToken(userID: $userId) {
          content
        }
      }
    `;

    const upg_email = "mjr076@shsu.edu" //will have to use an shsu.edu email as source for upGrade
    const reset_url = "http://localhost:4200/#/pass-reset" //link to reset page

    //get userID by email
    var user_id = await BackClient.query({
        query: GET_USER_ID,
        variables: {emailParam: email}
    });
    console.log(user_id.data.getUserbyEmail.userID)

    //generate / update token and fetch it
    var token_data = await BackClient.mutate({
        mutation: MAKE_TOKEN,
        variables: {userId: user_id.data.getUserbyEmail.userID}
    });

    if(token_data.errors != undefined){
        console.log("Errors encountered attempting to create/update Token")
        return false
    }

    var user_token = token_data.data.createorUpdateToken.content
    console.log(user_token)

    console.log('Sending reset link to '+email)

    //to send email:
    var response = await client.sendEmailWithTemplate({
        "From": upg_email,
        "To": email,
        "TemplateAlias": "password-reset",
        "TemplateModel": {
            "product_url": "",
            "product_name": "upGrade",
            "name": email,
            "auth_token": user_token,
            "action_url": reset_url, //URL To be determined
            "company_name": "upGrade",
            "company_address": "",
            "operating_system": "",
            "browser_name": "",
            "support_url": ""
        }
    })
    
    console.log("Error Code is: "+(response).ErrorCode)
    if((response).ErrorCode == 0){
        return true
    }
    console.log("Non 0 Error code while sending: Code "+(response).ErrorCode)
    return false
    
};

module.exports = reset_password