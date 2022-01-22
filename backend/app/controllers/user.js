import db from '../models/index.js';
import crypto from 'crypto';

const Users = db.users;

function create(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send({
            message: 'username or password is not porvided.'
        });
        return;
      };

    var token = crypto.randomBytes(16).toString('hex');
    Users.create({
        username: username,
        password: password,
        token: token
    })
    .then(data => {
        res.send({
            token: data.token
        });
    }).catch(err => {
        res.status(406).send({
            message: "Username already exists."
        });
        console.log(err.message);
    });
};

async function login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send({
            message: 'username or password is not porvided.'
        });
        return;
      };
    const user = await Users.findOne({
        where: { username: username, password: password}
    });
    if (!user) {
        res.status(404).send({message: 'Username or password is incorrect.'});
        return;
    };
    res.send({token: user.token});
};

export { create, login };