import express from 'express';
import { create, findOne, update, deleteOne } from '../controllers/note.js';

const router = express.Router();

function set_note_router(app) {

    // create new note
    router.post('/new', create);

    // get note by id
    router.get('/:id', findOne);

    // update note by id
    router.put('/:id', update);

    // delete note by id
    router.delete('/:id', deleteOne);


    app.use('/notes', router);
};

export default set_note_router;