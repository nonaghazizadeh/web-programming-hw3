function create_note_model(sequelize, Sequelize) {
    const Note = sequelize.define('note', {
        username: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        content: {
            type: Sequelize.TEXT
        }
    }, {
        timestamps: false
    });
    return Note;
};

export default create_note_model;