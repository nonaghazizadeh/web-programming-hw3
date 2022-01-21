function create_note_model(sequelize, Sequelize) {
    const Note = sequelize.define('note', {
        user_id: {
            type: Sequelize.INTEGER,
            autoIncrement: false,
            primaryKey: true
        },
        note_id: {
            type: Sequelize.INTEGER,
            autoIncrement: false,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
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