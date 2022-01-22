import db from '../models/index.js';
import { authenticate_user, authenticate_note } from './auth.js';

const Notes = db.notes;

async function create(req, res) {
    const token = req.headers.authorization;
    const user_auth = await authenticate_user(token);
    if (!user_auth.status) {
        res.send({
            message: user_auth.message
        });
        return;
    };

    const { title, content } = req.body;
    if (!title || !content) {
        res.send({
            message: 'title and content are not porvided.'
        });
        return;
    };
    Notes.create({
        username: user_auth.message,
        title: title,
        content: content
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Error while creating note!'
        });
    });
};

async function findOne(req, res) {
    const note_id = req.params.note_id;
    const token = req.headers.authorization;
    const user_auth = await authenticate_user(token);
    if (!user_auth.status) {
        res.send({
            message: user_auth.message
        });
        return;
    };

    const note_auth = await authenticate_note(user_auth.message, note_id);
    if (!note_auth.status) {
        res.send({
           message: note_auth.message 
        });
    } else {
        res.send({
            id: note_auth.id,
            title: note_auth.title,
            content: note_auth.content
        });
    };
};

export { create, findOne };