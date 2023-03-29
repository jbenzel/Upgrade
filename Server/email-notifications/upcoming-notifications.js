
async function upcoming_notif(){
    //upcoming grades email notification
    //this should be run automatically 1-2 times a week
    const { ApolloClient, InMemoryCache, createHttpLink, gql } = require("@apollo/client/core");

    const BackClient = new ApolloClient({
        link: createHttpLink({ uri: 'http://localhost:4000/graphql' }),
        cache: new InMemoryCache(),
    });
    
    //these queries can only be run once the database
    //relations have been established, otherwise error.
    const GET_STUDENTS = gql`
        query{
            getAllStudent {
                userID
            }
        }
    `;
    const GET_GRADES = gql`
        query($userIdParam: ID!) {
            getGradesbyUserID(userIDParam: $userIdParam) {
                dueDate
                urgency
                courseID
            }
        }
    `;

    console.log('Sending upcoming grade notifications emails...')

    //get all student IDs
    const { data } = await BackClient.query({
        query: GET_STUDENTS,
        variables: {}
    });
    if(data.getAllStudent.length !== 0){
        console.log('Sending to '+data.getAllStudent.length+' students.')

        //  for each grade
        grades = [] //array of JSON objects for each upcoming grade within 2 weeks

        const api_auth_token = "46b03d09-207a-4f2d-9796-4a5f31c642a7"
        var postmark = require("postmark");
        var client = new postmark.ServerClient(api_auth_token);
        const upg_email = "mjr076@shsu.edu" //will have to use an shsu.edu email as source for upGrade

        //send email for each student:
        /*client.sendEmailWithTemplate({
            "From": upg_email,
            "To": email,
            "TemplateAlias": "upcoming-notification",
            "TemplateModel": {
                "product_url": "",
                "product_name": "upGrade",
                "Grades": grades,
                    
                    [
                        {
                            "class": "class_Value",
                            "name": "name_Value",
                            "dueDate": "dueDate_Value"
                        },
                        {

                        },
                    ]
                    
                "company_name": "upGrade",
                "company_address": ""
            }
        })*/

    }else{
        console.log('No emails to send in database.')
    }

};

module.exports = upcoming_notif