function create_user_model(sequelize, Sequelize) {
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        token: {
            type: Sequelize.STRING,
            unique: true
        }
    }, {
        timestamps: false
    });
    return User;
};

export default create_user_model;