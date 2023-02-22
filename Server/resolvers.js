const resolvers = {
    Query: {
        //User Query
        async getUser(root, { userIDParam }, { models }) {
            let User = await models.User.findOne({ where: { userID: userIDParam } });

            return User;
        },
        async getAllUser(root, { userIDParam },{ models }) {
            let User = await models.User.findAll();

            return User;
        },

        //Student Query
        async  getStudentbyStudentID(root, { studentIDParam }, { models }) {
            let Student = await models.Student.findOne({ where: { studentID: studentIDParam } });

            return Student;
        },
        async  getStudentbyUserID(root, { userIDParam }, { models }) {
            let Student = await models.Student.findOne({ where: { userID: userIDParam } });
            
            return Student;
        },
        async getAllStudents(root, {studentIDParam}, { models }) {
            let Student = await models.Student.findAll();
            return Student;
        },

        //Grade
    },
    Mutation: {
        addUser(root, { email, password, role, firstName, lastName }, { models }) {
            if(email == null){
                return "Email is null"
            }
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
//            if (userID == null) {
//                return "Null ID";                
//            }
            return models.Student.create({
                eGPA: eGPA, 
                cGPA: cGPA, 
                completedCourseCount: completedCourseCount, 
                userID: userID,
            }).catch(err => {
                //console.log(err);
                return err;
            });
        },
        updateStudent(root, { studentIDParam, eGPA, cGPA, completedCourseCount, userID }, {models}){
            if (userID == null) {
                return "Null ID";                
            }            
            models.Student.update({
                eGPA: eGPA, 
                cGPA: cGPA, 
                completedCourseCount: completedCourseCount, 
                userID: userID,
            },
            {
                where: { studentID: studentIDParam }
            }).catch(err => {
                //console.log(err);
                return err;
            });
            return models.Student.findOne({ where: { studentID: studentIDParam } });
        },
    }
};

module.exports = resolvers;