//1,800,000
async function autoDeleteToken(){
  const { ApolloClient, useMutation, InMemoryCache, createHttpLink, gql } = require("@apollo/client/core");
	
  //create the client
  const BackClient = new ApolloClient({
    link: createHttpLink({ uri: 'http://localhost:4000/graphql' }),
    cache: new InMemoryCache(),
  });

  //Initialize backend Query Use
  const getTokenTime = gql`
    query Query {
      getAllToken {
        tokenID
        creationTime
      }
    }
  `;
  const deleteTokenbyID = gql`
    mutation Mutation($tokenIdParam: ID!) {
      deleteToken(tokenIDParam: $tokenIdParam) {
        tokenID
      }
    }
  `;
  
  //Query database and retrieve all tokens
  var {data} = await BackClient.query({
    query: getTokenTime, 
      variables: {}
  });
  var tokenTimes = data.getAllToken;
  let cDate = Date.now();
  
  //sort through all tokens, compare time, and if they are over 30 min old delete them.
  for(let t = 0; t < tokenTimes.length; t++){
    if( cDate > (parseInt(tokenTimes[t].creationTime) + 1800000) ){
      console.log("this prompted true at: " + tokenTimes[t].creationTime + " when current time is: " + cDate)

      await BackClient.mutate({
        mutation: deleteTokenbyID, 
        variables: {
        tokenIdParam: tokenTimes[t].tokenID
        }
        
     });
   }
  }      
}
module.exports = autoDeleteToken