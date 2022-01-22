import db from '../models/index.js';
import authenticate from './auth.js';

const Notes = db.notes;

function create(req, res) {
    Notes.create(req.body).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Error while creating note!'
        });
    });
};

async function findOne(req, res) {
    const title = req.params.title;
    let token = req.headers.authorization;
    if (!token) {
        res.status(404).send({
            message: 'token not provided.'
        });
        return;
    };
    token = token.split(' ')[1];
    const auth = await authenticate(token, title);
    if (!auth.status) {
        res.send({
            message: auth.message
        });
        return;
    };

    const note = await Notes.findOne({where: {title: auth.title, username: auth.username}});
    res.send({
        content: note.content
    });
};

export { create, findOne };