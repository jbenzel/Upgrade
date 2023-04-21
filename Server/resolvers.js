const reset_password = require('./email-notifications/password-reset')
const setNewPassword = require('./setNewPassword')
const characters ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789';
const {AESmodule} = require("./AESmodule")
const AES = new AESmodule()

function generateString(length) {
    let result = '';
    const charLength = characters.length;
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}

const resolvers = {
    Query: {
        //User Query
        async getAllUser(root, { userIDParam },{ models }) {
            let User = await models.User.findAll();

            return User;
        },
        async getUserbyID(root, { userIDParam }, { models }) {
            let User = await models.User.findOne({ where: { userID: userIDParam } });

            return User;
        },
        async getUserbyEmail(root, { emailParam }, { models }) {
            let User = await models.User.findOne({ where: { email: emailParam } });

            return User;
        },
        async validateUser(root, { emailParam, passwordParam}, { models }) {
            let User = await models.User.findOne({ where: { email: emailParam } });
            console.log(User);
            if(User == null){
                return null;
            }
            if(User.dataValues.password == passwordParam){
                return User;
            }
            else{
                return null;
            }
        },

        //Student Query
        async getAllStudent(root, { studentIDParam }, { models }) {
            let Student = await models.Student.findAll();
            return Student;
        },
        async  getStudentbyUserID(root, { userIDParam }, { models }) {
            let Student = await models.Student.findOne({ where: { userID: userIDParam } });
            
            return Student;
        },
        async  getStudentbyStudentID(root, { studentIDParam }, { models }) {
            let Student = await models.Student.findOne({ where: { studentID: studentIDParam } });

            return Student;
        },

        //Course
        async getAllCourse(root, { courseIDParam }, { models }) {
            let Course = await models.Course.findAll();
            return Course;
        },
        async  getCoursebyCourseID(root, { courseIDParam }, { models }) {
            let Course = await models.Course.findOne({ where: { courseID: courseIDParam } });
            
            return Course;
        },
        async  getAllCoursesbyUserID(root, { userIDParam }, { models }) {
            let Course = await models.Course.findAll({ where: { userID: userIDParam } });
            
            return Course;
        },

        //PrevCourse
        async getAllPrevCourse(root, { prevCourseIDParam }, { models }) {
            let PrevCourse = await models.PrevCourse.findAll();

            return PrevCourse;
        },
        async  getPrevCoursebyPrevCourseID(root, { prevCourseIDParam }, { models }) {
            let PrevCourse = await models.PrevCourse.findOne({ where: { prevCourseID: prevCourseIDParam } });
            
            return PrevCourse;
        },
        async  getAllPrevCoursebyUserID(root, { userIDParam }, { models }) {
            let PrevCourse = await models.PrevCourse.findAll({ where: { userID: userIDParam } });
            
            return PrevCourse;
        },

        //Token
        async getAllToken(root, { tokenIDParam }, { models }) {
            let Token = await models.Token.findAll();

            return Token;
        },
        async  getTokenbyTokenID(root, { tokenIDParam }, { models }) {
            let Token = await models.Token.findOne({ where: { tokenID: tokenIDParam } });
            
            return Token;
        },
        async  getTokenbyUserID(root, { userIDParam }, { models }) {
            let Token = await models.Token.findAll({ where: { userID: userIDParam } });
            
            return Token;
        },

        //Grade
        async  getAllGrade(root, { gradeIDParam }, { models }) {
            let Grade = await models.Grade.findAll();
            
            return Grade;
        },
        async  getGradebyGradeID(root, { gradeIDParam }, { models }) {
            let Grade = await models.Grade.findOne({ where: { gradeID: gradeIDParam } });
            
            return Grade;
        },
        async  getAllGradesbyUserID(root, { userIDParam }, { models }) {
            let Grade = await models.Grade.findAll({ where: { userID: userIDParam } });
            
            return Grade;
        },
        async  getAllGradebyCourseID(root, { courseIDParam }, { models }) {
            let Grade = await models.Grade.findAll({ where: { courseID: courseIDParam } });
            
            return Grade;
        },

        //Executions (Marcos added this, remove if it starts breaking stuff)
        async sendResetEmail(root, { emailParam }, { models }) {
            let User = await models.User.findOne({ where: { email: emailParam } });
            if(User != null){
                //if user exists, execute procedure
                var success = reset_password(emailParam)
                console.log(await success)
                if(await success){
                    //if no errors while sending
                    return User;
                }
            }
            return null;
        },


        async setNewPassword(root, { emailParam, password, content }, { models }) {
            let User = await models.User.findOne({ where: { email: emailParam } });
            if(User != null){
                //if user exists, execute
                var success = setNewPassword(emailParam, password, content)
                console.log(await success)
                if(await success){
                    //if no errors and valid token
                    return User;
                }
            }
            return null;
        },

    },
    
    Mutation: {
        async addUser(root, { email, firstName, lastName, role }, { models }) {
            let inPass = await generateString(16)
            return models.User.create({
                email: email,
                password: inPass,
                firstName: firstName,
                lastName: lastName,
                role: role,
                firstLogin: true
            }).catch(err => {
                return err;
            });
        },
        updateUser(root, { userIDParam, email, password, firstName, lastName, role, firstLogin }, { models }) {           
            if(email == null){
                return "Email is null"
            }
            models.User.update({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: role,
                firstLogin: firstLogin
            },
            {
                where: { userID: userIDParam }
            }).catch(err => {
                //console.log(err);
                return err;
            });
            return models.User.findOne({ where: { userID: userIDParam } });
        },
        //User Mutations
        deleteUser(root, { userIDParam }, { models }) {
            models.User.destroy(
                {
                    where: { userID: userIDParam }
                }
            ).then((result) => {
                return result;
            }).catch(err => {
                //console.log(err);
                return false;
            });
        },

        //Student Mutations
        addStudent(root, { eGPA, cGPA, completedCourseCount, userID }, { models }) {
            return models.Student.create({
                eGPA: eGPA, 
                cGPA: cGPA, 
                completedCourseCount: completedCourseCount, 
                userID: userID,
            }).catch(err => {
                return err;
            });
        },
        updateStudent(root, { studentIDParam, eGPA, cGPA, completedCourseCount, userID }, {models}){        
            models.Student.update({
                eGPA: eGPA, 
                cGPA: cGPA, 
                completedCourseCount: completedCourseCount, 
                userID: userID,
            },
            {
                where: { studentID: studentIDParam }
            }).catch(err => {
                return err;
            });
            return models.Student.findOne({ where: { studentID: studentIDParam } });
        },
        deleteStudent(root, { studentIDParam }, { models }) {
            models.Student.destroy(
                {
                    where: { studentID: studentIDParam }
                }
            ).then((result) => {
                return result;
            }).catch(err => {
                return false;
            });
        },

        //Course Mutations
        addCourse(root, { courseName, courseCode, courseNum, courseCredits, userID }, { models }) {
            return models.Course.create({
                courseName: courseName,
                courseCode: courseCode,
                courseNum: courseNum, 
                courseCredits: courseCredits,
                userID: userID
            }).catch(err => {
                return err;
            });
        },
        updateCourse(root, { courseIDParam, courseName, courseCode, courseNum, courseCredits, userID }, {models}){        
            models.Course.update({
                courseName: courseName,
                courseCode: courseCode,
                coursNum: courseNum, 
                courseCredits: courseCredits,
                userID: userID
            },
            {
                where: { courseID: courseIDParam }
            }).catch(err => {
                return err;
            });
            return models.Course.findOne({ where: { courseID: courseIDParam } });
        },
        deleteCourse(root, { courseIDParam }, { models }) {
            models.Course.destroy(
                {
                    where: { courseID: courseIDParam }
                }
            ).then((result) => {
                return result;
            }).catch(err => {
                return false;
            });
        },

        //PrevCourseMutations
        addPrevCourse(root, { pCourseName, pCourseNum, pCourseGrade, pCourseCredits, userID }, { models }) {
            return models.PrevCourse.create({
                pCourseName: pCourseName,
                pCourseNum: pCourseNum,
                pCourseGrade: pCourseGrade, 
                pCourseCredits: pCourseCredits, 
                userID: userID
            }).catch(err => {
                return err;
            });
        },
        updatePrevCourse(root, { prevCourseIDParam, pCourseName, pCourseNum, pCourseGrade, pCourseCredits, userID }, {models}){        
            models.PrevCourse.update({
                pCourseName: pCourseName,
                pCourseNum: pCourseNum,
                pCourseGrade: pCourseGrade, 
                pCourseCredits: pCourseCredits, 
                userID: userID
            },
            {
                where: { prevCourseID: prevCourseIDParam }
            }).catch(err => {
                return err;
            });
            return models.PrevCourse.findOne({ where: { prevCourseID: prevCourseIDParam } });
        },
        deletePrevCourse(root, { prevCourseIDParam }, { models }) {
            models.PrevCourse.destroy(
                {
                    where: { courseID: prevCourseIDParam }
                }
            ).then((result) => {
                return result;
            }).catch(err => {
                return false;
            });
        },

        //Token Mutations

        deleteToken(root, { tokenIDParam }, { models } ){
            models.Token.destroy(
                {
                    where: { tokenID: tokenIDParam }
                }
            ).then((result) => {
                return result;
            }).catch(err => {
                return false;
            });
        },
        
        async createorUpdateToken(root, { tokenIDParam, content, creationTime, userID}, { models } ){
            let Token = await models.Token.findOne({ where: {userID: userID} });
            let date = Date.now();
            date = date.toString();
            let inPass = await generateString(6)
            inPass = AES.encrypt(inPass)
            if(Token != null){
                models.Token.update({
                    content: inPass, 
                    creationTime: date, 
                    userID: userID
                },
                {
                    where: { userID: userID }
                }).catch(err => {
                    return false;
                })                
            }
            else{
                models.Token.create({
                    content: inPass, 
                    creationTime: date,
                    userID: userID
                }).catch(err => {
                    return false;
                })
            }
            return models.Token.findOne({ where: { userID: userID } });
        },


        //Grade Mutations
        addGrade(root, { name, dueDate, expectedGrade, grade, category, weight, urgency, locked, courseID, userID, history }, { models }) {
            return models.Grade.create({
                name: name,
                dueDate: dueDate, 
                expectedGrade: expectedGrade,
                grade: grade, 
                category: category, 
                weight: weight, 
                urgency: urgency, 
                locked: locked, 
                courseID: courseID, 
                userID: userID,
                history: history
            }).catch(err => {
                console.log(userID);
                return err;
            });
        },
        updateGrade(root, { gradeIDParam, name, dueDate, expectedGrade, grade, category, weight, urgency, locked, courseID, userID, history }, { models }) {
            models.Grade.update({
                name: name,
                dueDate: dueDate, 
                expectedGrade: expectedGrade,
                grade: grade, 
                category: category, 
                weight: weight, 
                urgency: urgency, 
                locked: locked, 
                courseID: courseID, 
                userID: userID,
                history: history
            },
            {
                where: { gradeID: gradeIDParam }
            }).catch(err => {
                return err;
            });
            return models.Grade.findOne({ where: { gradeID: gradeIDParam } });
        },
        deleteGrade(root, { gradeIDParam }, { models }) {
            models.Grade.destroy(
                {
                    where: { gradeID: gradeIDParam }
                }
            ).then((result) => {
                return result;
            }).catch(err => {
                return false;
            });
        },

    }
};

module.exports = resolvers;