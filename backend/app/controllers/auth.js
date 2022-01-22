import db from '../models/index.js';

const Users = db.users;
const Notes = db.notes;

async function authenticate_user(token) {
    if (!token) {
        return {
            status: false,
            message: 'Token is not provided.'
        };
    };
    token = token.split(' ')[1];
    if (!token) {
        return {
            status: false,
            message: 'Provide token in order {Token ***}'
        };
    };
    
    const user = await Users.findOne({where: {
        token: token
    }});
    if (!user) {
        return {
            status: false,
            message: 'Fake token!'
        };
    };

    return {
        status: true,
        message: user.username
    }
};

async function authenticate_note(username, note_id) {
    const note = await Notes.findByPk(note_id);
    if (!note) {
        return {
            status: false,
            code: 406,
            message: 'Note does not exist.'
        };
    };
    if (note.username != username) {
        return {
            status: false,
            code: 403,
            message: 'Do not have premission to access this note.'
        };
    };

    return {
        status: true,
        id: note.id,
        title: note.title,
        content: note.content
    };
};

export { authenticate_note, authenticate_user };