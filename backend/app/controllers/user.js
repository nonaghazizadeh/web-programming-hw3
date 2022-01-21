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

async function login(req, res) {
    const { username, password } = req.body;
    const user = await Users.findOne({
        where: { username: username, password: password}
    });
    if (!user) {
        res.status(404).send({message: 'Cannot find user'});
        return;
    };
    res.send({token: user.token});
};

export { create, login };