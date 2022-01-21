import db from '../models/index.js';

const Notes = db.notes;

function create(req, res) {
    Notes.create(req.body).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Error while creating note!'
        });
    });
}

function findOne(req, res) {
    const note_id = req.params.note_id
    console.log(note_id)
    Notes.findByPk(note_id).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({message: 'Cannot find note with id=' + note_id});
        }
    }).catch(err => {
        res.status(500).send({message: 'Error retrieving note with id=' + note_id});
    });
}

export { create, findOne };