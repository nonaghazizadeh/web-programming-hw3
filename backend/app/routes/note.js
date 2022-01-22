import express from 'express';
import {
    create as create_note,
    findOne as get_note
} from '../controllers/note.js';

const router = express.Router();

function set_note_router(app) {

    // create new note
    router.post('/new', create_note);

    // get single note by id
    router.get('/:note_id', get_note);


    app.use('/notes', router);
};

export default set_note_router;