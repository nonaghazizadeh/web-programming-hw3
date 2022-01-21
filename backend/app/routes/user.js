import express from 'express';
import create from '../controllers/user.js';

const router = express.Router();

function set_user_router(app) {

    // register user
    router.post('/register', create);

    // login uesr
    router.post('/login', );


    app.use('/users', router);
};

export default set_user_router;