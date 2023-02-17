const resolvers = {
    Query: {
        async getUser(root, { userIDParam }, { models }) {
            let User = await models.User.findOne({ where: { userID: userIDParam } });

            return User;
        },
        async getAllUsers(root, { userIDParam }, { models }) {
            let Users = await models.User.findAll();

            return Users;
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
            models.User.update(
                {
                    email: email,
                    password: password,
                    role: role,
                    firstName: firstName,
                    lastName: lastName,
                },
                {
                    where: { userID: userIDParam }
                }
            ).catch(err => {
                //console.log(err);
                return err;
            });
            return models.User.findOne({ where: { userID: userIDParam } });
        },
        deleteUser(root, { userIDParam }, { models }) {
            models.User.destroy(
                {
                    where: { userID: userIDParam }
                }
            ).then((result) => {
                return result
            }).catch(err => {
                //console.log(err);
                return false;
            });
        },
    }
};

module.exports = resolvers;