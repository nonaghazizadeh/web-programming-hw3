function create_note_model(sequelize, Sequelize) {
    const Note = sequelize.define('note', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
            require: true,
            null: false
        },
        title: Sequelize.STRING,
        content: Sequelize.TEXT
    }, {
        timestamps: false
    });
    return Note;
};

export default create_note_model;