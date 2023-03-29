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
        addUser(root, { email, password, role, firstName, lastName }, { models }) {
            return models.User.create({
                email: email,
                password: password,
                role: role,
                firstName: firstName,
                lastName: lastName,
            }).catch(err => {
                //console.log(err);
            });
        },
        updateUser(root, { userIDParam, email, password, role, firstName, lastName }, { models }) {           
            if(email == null){
                return "Email is null"
            }
            models.User.update({
                email: email,
                password: password,
                role: role,
                firstName: firstName,
                lastName: lastName,
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
        addCourse(root, { courseCode, courseName, userID }, { models }) {
            return models.Course.create({
                courseCode: courseCode,
                courseName: courseName,
                userID: userID
            }).catch(err => {
                return err;
            });
        },
        updateCourse(root, { courseIDParam, courseCode, courseName, userID }, {models}){        
            models.Course.update({
                courseCode: courseCode,
                courseName: courseName,
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

        //Grade Mutations
        addGrade(root, { urgency, weight, dueDate, expectedGrade, grade, category, courseID, userID }, { models }) {
            return models.Grade.create({
                urgency: urgency, 
                weight: weight,
                dueDate: dueDate,
                expectedGrade: expectedGrade, 
                grade: grade, 
                category: category, 
                courseID: courseID, 
                userID: userID
            }).catch(err => {
                console.log(userID);
                return err;
            });
        },
        updateGrade(root, { gradeIDParam, urgency, weight, dueDate, expectedGrade, grade, category, courseID, userID }, { models }) {
            models.Grade.update({
                urgency: urgency, 
                weight: weight,
                dueDate: dueDate,
                expectedGrade: expectedGrade, 
                grade: grade, 
                category: category, 
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