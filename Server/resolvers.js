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

    },
    Mutation: {
        addUser(root, { email, password, firstName, lastName, role }, { models }) {
            return models.User.create({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: role
            }).catch(err => {
                //console.log(err);
            });
        },
        updateUser(root, { userIDParam, email, password, firstName, lastName, role }, { models }) {           
            if(email == null){
                return "Email is null"
            }
            models.User.update({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: role
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
                coursNum: courseNum, 
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

        addToken(root, { content, creationTime, userID}, { models } ){
            return models.Token.create({
                content: content, 
                creationTime: creationTime, 
                userID: userID
            })
        },
        updateToken(root, { tokenIDParam, content, creationTime, userID}, { models } ){
            models.Token.update({
                content: content, 
                creationTime: creationTime, 
                userID: userID
            },
            {
                where: { tokenID: tokenIDParam }
            }).catch(err => {
                return err;
            });
            return models.Token.findOne({ where: { tokenID: tokenIDParam } });
        
        },
        deleteToken(root, { tokenIDParam }, { models } ){
            models.PrevCourse.destroy(
                {
                    where: { tokenID: tokenIDParam }
                }
            ).then((result) => {
                return result;
            }).catch(err => {
                return false;
            });
        },


        //Grade Mutations
        addGrade(root, { name, dueDate, expectedGrade, grade, category, weight, urgency, locked, courseID, userID }, { models }) {
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
                userID: userID
            }).catch(err => {
                console.log(userID);
                return err;
            });
        },
        updateGrade(root, { gradeIDParam, name, dueDate, expectedGrade, grade, category, weight, urgency, locked, courseID, userID }, { models }) {
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
                userID: userID
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