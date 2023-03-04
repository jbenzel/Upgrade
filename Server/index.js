const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const { Sequelize } = require("sequelize")
const { ApolloServer, gql } = require("apollo-server");
const reset_password = require('./email-notifications/password-reset')
const upcoming_notif = require('./email-notifications/upcoming-notifications')


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './upgrade.sqlite'
});

const models = {};

const Model = Sequelize.Model
class User extends Model {
}
User.init({
    userID: {
        type: Sequelize.DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    email: {
        type: Sequelize.DataTypes.TEXT
    },
    password: {
        type: Sequelize.DataTypes.TEXT
    },
    role: {
        type: Sequelize.DataTypes.TINYINT //8bit instead of 32
    },
    firstName: {
        type: Sequelize.DataTypes.TEXT
    },
    lastName: {
        type: Sequelize.DataTypes.TEXT
    }
},{ sequelize, timestamps: false })
//models["User"] = User;

class Student extends Model {
}
Student.init({
    //inherit UserID
    studentID:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    eGPA: {
        type: Sequelize.DataTypes.FLOAT
    },
    cGPA: {
        type: Sequelize.DataTypes.FLOAT
    },
    completedCourseCount: {
        type: Sequelize.DataTypes.SMALLINT
    }
}, { sequelize, timestamps: false })
//models["Student"] = Student;

class Course extends Model {
}
Course.init({
    courseID:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    //inherit userID
    courseCode:{
        type: Sequelize.DataTypes.TEXT
    },
    courseName:{
        type: Sequelize.DataTypes.TEXT
    }
}, { sequelize, timestamps: false })
//models["Course"] = Course;

class Grade extends Model {
}
Grade.init({
    gradeID:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    //inherit userID
    //inherit courseID
    urgency:{
        type: Sequelize.DataTypes.TINYINT
    },
    weight:{
        type: Sequelize.DataTypes.FLOAT
    },
    dueDate:{
        type: Sequelize.DataTypes.DATE //DATEONLY if time isnt neccesary
    },
    expectedGrade:{
        type: Sequelize.DataTypes.FLOAT
    },
    grade:{
        type: Sequelize.DataTypes.FLOAT
    },
    category:{
        type: Sequelize.DataTypes.TEXT
    },
    name:{
        type: Sequelize.DataTypes.TEXT
    }
}, { sequelize, timestamps: false })
//models["Grade"] = Grade;

Student.belongsTo(User, {
    foreignKey: 'userID'
});
Course.belongsTo(User, {
    foreignKey: 'userID'
});
Grade.belongsTo(Course, {
    foreignKey: 'courseID'
});
Grade.belongsTo(Course, {
    foreignKey: 'userID'
});
/*
Grade.belongsTo(User, {
    foreignKey: 'userID'
});
*/

sequelize.sync();
sequelize.authenticate();

models["User"] = User;
models["Student"] = Student;
models["Course"] = Course;
models["Grade"] = Grade;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    context: ({req, res}) => ({models, req, res})
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });


reset_password('')
upcoming_notif()