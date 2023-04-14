
async function setNewPassword(email, password, token_content){
    const { ApolloClient, InMemoryCache, createHttpLink, gql } = require("@apollo/client/core");
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

    const GET_TOKEN = gql`
    query ($userIdParam: ID!) {
        getTokenbyUserID(userIDParam: $userIdParam) {
          content
          tokenID
        }
      }
    `;

    const UPDATE_PASSWORD = gql`
    mutation ($userIdParam: Int!, $email: String!, $password: String!) {
        updateUser(userIDParam: $userIdParam, email: $email, password: $password) {
          password
        }
      }
    `;

    const DESTROY_TOKEN = gql`
    mutation ($tokenIdParam: ID!) {
        deleteToken(tokenIDParam: $tokenIdParam) {
          tokenID
        }
      }
    `;

    //get user ID corresponding to emailParam
    var user_id_data = await BackClient.query({
        query: GET_USER_ID,
        variables: {emailParam: email}
    });
    var user_id = user_id_data.data.getUserbyEmail.userID
    console.log(user_id)

    //get Token corresponding to User ID
    var token_data = await BackClient.query({
        query: GET_TOKEN,
        variables: {userIdParam: user_id}
    });
    console.log(token_data)

    //catch null data
    if(token_data.data.getTokenbyUserID.length == 0){
        console.log("No token_data retrieved")
        return false
    }

    var retreived_token = token_data.data.getTokenbyUserID[0].content
    console.log("retrived token is "+retreived_token)

    //if a token has not been created, cancel
    if(retreived_token == null){
        return false
    }
    //if the client provided token does not match server token
    if(retreived_token != token_content){
        return false
    }

    console.log("Updating password...")
    console.log(user_id)
    console.log(password)
    console.log(email)
    //since token matches token_content, update password to new password
    var update_pass = await BackClient.mutate({
        mutation: UPDATE_PASSWORD,
        variables: {userIdParam: parseInt(user_id), 
                    email: email,
                    password: password, }
    });
    console.log(update_pass)
    //if errors occur
    if(update_pass.errors != undefined){
        console.log("Errors encountered while updating password")
        return false
    }
    //check that updated pass == given pass
    if(update_pass.data.updateUser.password != password){
        return false
    }

    //destroy token
    console.log("destroying token.")
    console.log(token_data.data.getTokenbyUserID[0])
    var destroy_result = await BackClient.mutate({
        mutation: DESTROY_TOKEN,
        variables: {tokenIdParam: parseInt(token_data.data.getTokenbyUserID[0].tokenID)}
    });
    console.log(destroy_result)
    //if no errors while destroying token, return true
    if(destroy_result.errors != undefined){
        console.log("Errors encountered while deleting token")
        return false
    }else{
        console.log("Token successfully deleted")
        return true
    }

}

module.exports = setNewPassword