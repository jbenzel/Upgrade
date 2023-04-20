
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const { Sequelize } = require("sequelize")
const { ApolloServer, gql } = require("apollo-server");
const upcoming_notif = require('./email-notifications/upcoming-notifications')

const tokenExpireLoop = require('./tokenAutoDelete')

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
    firstName: {
        type: Sequelize.DataTypes.TEXT
    },
    lastName: {
        type: Sequelize.DataTypes.TEXT
    }, 
    role: {
        type: Sequelize.DataTypes.TEXT 
    },
    firstLogin: { 
        type: Sequelize.DataTypes.BOOLEAN
        
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
        type: Sequelize.DataTypes.TEXT
    },
    cGPA: {
        type: Sequelize.DataTypes.TEXT
    },
    completedCourseCount: {
        type: Sequelize.DataTypes.TEXT
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
    courseName:{
        type: Sequelize.DataTypes.TEXT
    },
    courseCode:{
        type: Sequelize.DataTypes.TEXT
    },
    courseNum:{
        type: Sequelize.DataTypes.TEXT
    },
    credits:{
        type: Sequelize.DataTypes.TEXT
    }
}, { sequelize, timestamps: false })
//models["Course"] = Course;

class PrevCourse extends Model {
}
PrevCourse.init({
    prevCourseID:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    pCourseName:{
        type: Sequelize.DataTypes.TEXT
    },
    pCourseNum:{
        type: Sequelize.DataTypes.TEXT
    },
    pCourseGrade:{
        type: Sequelize.DataTypes.TEXT
    },
    pCourseCredits:{
        type: Sequelize.DataTypes.TEXT
    }
}, { sequelize, timestamps: false })

class Token extends Model{
}
Token.init({
    tokenID: {
        type: Sequelize.DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    content: {
        type: Sequelize.DataTypes.TEXT
    },
    creationTime: {
        type: Sequelize.DataTypes.TEXT
    }
}, { sequelize, timestamps: false })


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
    
    name:{
        type: Sequelize.DataTypes.TEXT
    },
    dueDate:{
        type: Sequelize.DataTypes.TEXT //DATEONLY if time isnt neccesary
    },
    expectedGrade:{
        type: Sequelize.DataTypes.TEXT
    },
    grade:{
        type: Sequelize.DataTypes.TEXT
    },
    category:{
        type: Sequelize.DataTypes.TEXT
    },
    weight:{
        type: Sequelize.DataTypes.TEXT
    },
    urgency:{
        type: Sequelize.DataTypes.TEXT
    },
    locked:{
        type: Sequelize.DataTypes.BOOLEAN
    },
    userID:{
        type: Sequelize.DataTypes.TEXT
    },
    history:{
        type: Sequelize.DataTypes.BOOLEAN
    },
}, { sequelize, timestamps: false })
//models["Grade"] = Grade;

Student.belongsTo(User, {
    foreignKey: 'userID'
});
Course.belongsTo(User, {
    foreignKey: 'userID'
});
PrevCourse.belongsTo(User, {
    foreignKey: 'userID'
});
Token.belongsTo(User, {
    foreignKey: 'userID'
});

Grade.belongsTo(Course, {
    foreignKey: 'courseID'
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
models["PrevCourse"] = PrevCourse;
models["Token"] = Token;
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


const notif_interval = 3.5 * 24 * 60 * 60 * 1000 //sleeps for 3.5 days
//will see if there's an alternative to this than milisecond sleep
setInterval(() => {
    upcoming_notif()
}, notif_interval);


setInterval(() => {
    tokenExpireLoop()
}, (10 * 1000) )
