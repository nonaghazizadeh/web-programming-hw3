import db from '../models/index.js';
import crypto from 'crypto';

const Users = db.users;

function create(req, res) {
    const { username, password } = req.body;
    var token = crypto.randomBytes(16).toString('hex');
    Users.create({
        username: username,
        password: password,
        token: token
    })
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Error while creating note!'
        });
    });
};

export default create;