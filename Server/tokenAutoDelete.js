//1,800,000
async function autoDeleteToken(){
    const { ApolloClient, useMutation, InMemoryCache, createHttpLink, gql } = require("@apollo/client/core");
	//create the client
    const BackClient = new ApolloClient({
        link: createHttpLink({ uri: 'http://localhost:4000/graphql'}),
        cache: new InMemoryCache(),
    });
    const getTokenTime = gql`
    query Query {
        getAllToken {
          tokenID
          creationTime
        }
      }`;
      const deleteTokenbyID = gql`
      mutation Mutation($tokenIdParam: ID!) {
        deleteToken(tokenIDParam: $tokenIdParam) {
          tokenID
        }
      }`;
      
      var {data} = await BackClient.query({
        query: getTokenTime, 
        variables: {}
      });
      var tokenTimes = data.getAllToken;
      let cDate = Date.now();
      //cDate = cDate.toString();
      //getting token times = 
      //{data}
      //variables is the variables for the tokenTime query
      
      //console.log(" test: " + cDate)
      for(let t = 0; t < tokenTimes.length; t++){
        //console.log(tokenTimes[t].creationTime)
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
      
      //console.log(tokenTimes.data.getAllToken[0])
   }
module.exports = autoDeleteToken