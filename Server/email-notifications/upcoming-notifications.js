async function upcoming_notif(){
    //upcoming grades email notification
    //this should be run automatically 1-2 times a week
    const { ApolloClient, InMemoryCache, createHttpLink, gql } = require("@apollo/client/core");
    const {AESmodule} = require("../AESmodule")
    const AES = new AESmodule()

    const BackClient = new ApolloClient({
        link: createHttpLink({ uri: 'http://localhost:4000/graphql'}),
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
    query ($userIdParam: ID!) {
        getAllGradesbyUserID(userIDParam: $userIdParam) {
          dueDate
          courseID
          name
        }
      }
    `;
    const GET_COURSE = gql`
    query ($courseIdParam: ID!) {
        getCoursebyCourseID(courseIDParam: $courseIdParam) {
          courseName
        }
      }
    `;
    const GET_EMAIL = gql`
    query GetUserbyID($userIdParam: ID!) {
        getUserbyID(userIDParam: $userIdParam) {
          email
        }
      }
    `;


    console.log('Sending upcoming grade notifications emails...')

    //get all student IDs
    var { data } = await BackClient.query({
        query: GET_STUDENTS,
        variables: {}
    });
    if(data.getAllStudent.length !== 0){
        console.log('Sending to '+data.getAllStudent.length+' students.')
        var studentIDs = data.getAllStudent

        const api_auth_token = "46b03d09-207a-4f2d-9796-4a5f31c642a7"
        var postmark = require("postmark");
        var client = new postmark.ServerClient(api_auth_token);
        const upg_email = "mjr076@shsu.edu" //will have to use an shsu.edu email as source for upGrade
        
        //for each student
        for(let stu = 0; stu < studentIDs.length; stu++){
            var current_student = studentIDs[stu].userID
            var {data} = await BackClient.query({
                query: GET_GRADES,
                variables: {userIdParam: current_student}
            });
            //must filter out far out grades, only include upcoming in the next 2 weeks or so
            var grades_response = data

            var grades_info = [] //array of JSON objects for each upcoming grade within 2 weeks

            //for each grade, produce JSON and store in grades_info
            for(let gra = 0; gra < grades_response.getAllGradesbyUserID.length; gra++){
                var current_grade = grades_response.getAllGradesbyUserID[gra]

                var grade_name = current_grade.name

                var due_date = current_grade.dueDate
                var currentDate = new Date();
                var two_weeks_ahead = new Date(Date.now() + 12096e5)
                console.log(two_weeks_ahead)
                var month = due_date.slice(0, 2)
                var day = due_date.slice(3, 5)
                var year = due_date.slice(6)
                var dateToCheck = new Date(year+"-"+month+"-"+day);
                console.log(dateToCheck)
                
                if(dateToCheck < currentDate || dateToCheck > two_weeks_ahead){
                    //if the due date is not within the next 2 weeks, skip it
                    continue
                }

                //get the name of the course based on course ID
                var {data} = await BackClient.query({
                    query: GET_COURSE,
                    variables: {courseIdParam: current_grade.courseID}
                });
                var course_name = data.getCoursebyCourseID.courseName

                grades_info.push({
                    "class": course_name,
                    "name": grade_name,
                    "dueDate": due_date,
                })

            }
            console.log(grades_info)
            //lastly, get student email
            var {data} = await BackClient.query({
                query: GET_EMAIL,
                variables: {userIdParam: current_student}
            });
            var email = data.getUserbyID.email
            
            //send email for each student:
            if(grades_info != []){
                console.log("sending to "+email)
                var response = client.sendEmailWithTemplate({
                    "From": upg_email,
                    "To": email,
                    "TemplateAlias": "upcoming-notification",
                    "TemplateModel": {
                        "product_url": "",
                        "product_name": "upGrade",
                        "Grades": grades_info,
                        "company_name": "upGrade",
                        "company_address": ""
                    }
                })
                console.log("Send response: "+(await response).ErrorCode)
                
            }

        }

    }else{
        //if no grades in database for this student
        console.log('No grades to send in database.')
    }

};

module.exports = upcoming_notif