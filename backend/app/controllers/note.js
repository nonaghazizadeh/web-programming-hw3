import db from '../models/index.js';
import { authenticate_user, authenticate_note } from './auth.js';

const Notes = db.notes;

async function create(req, res) {
    const token = req.headers.authorization;
    const user_auth = await authenticate_user(token);
    if (!user_auth.status) {
        res.status(401).send({
            message: user_auth.message
        });
        return;
    };

    const { title, content } = req.body;
    if (!title || !content) {
        res.status(400).send({
            message: 'title or content is not porvided.'
        });
        return;
    };
    Notes.create({
        username: user_auth.message,
        title: title,
        content: content
    }).then(data => {
        res.send({
            id: data.id,
            title: data.title
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Error while creating note!'
        });
    });
};

async function findOne(req, res) {
    const id = req.params.id;
    if (!id) {
        res.status(400).send({
            message: 'id is not porvided.'
        });
        return;
      };

    const token = req.headers.authorization;
    const user_auth = await authenticate_user(token);
    if (!user_auth.status) {
        res.status(401).send({
            message: user_auth.message
        });
        return;
    };

    const note_auth = await authenticate_note(user_auth.message, id);
    if (!note_auth.status) {
        res.status(note_auth.code).send({
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

async function update(req, res) {
  const {title, content } = req.body;
  const id = req.params.id;
  if (!id || !title || !content) {
    res.status(400).send({
        message: 'id or title or content is not porvided.'
    });
    return;
  };
  
  const token = req.headers.authorization;
  const user_auth = await authenticate_user(token);
  if (!user_auth.status) {
      res.status(401).send({
          message: user_auth.message
      });
      return;
  };

  const note_auth = await authenticate_note(user_auth.message, id);
  if (!note_auth.status) {
      res.status(note_auth.code).send({
         message: note_auth.message 
      });
  } else {
    Notes.update({
        title: title,
        content: content
    }, {
        where: {id: id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: 'Note updated successfully.'
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating note with id: " + id
          });
    });
  };
};

async function deleteOne(req, res) {
    const id = req.params.id;
    if (!id) {
        res.satuts(400).send({
            message: 'id is not porvided.'
        });
        return;
      };

    const token = req.headers.authorization;
    const user_auth = await authenticate_user(token);
    if (!user_auth.status) {
        res.status(401).send({
            message: user_auth.message
        });
        return;
    };

    const note_auth = await authenticate_note(user_auth.message, id);
    if (!note_auth.status) {
        res.status(note_auth.code).send({
           message: note_auth.message 
        });
    } else {
        Notes.destroy({
            where: {id: id}
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Successfully deleted note with id: " + id
                });
            };
        }).catch(err => {
            res.status(500).send({
                message: "Error deleting note with id: " + id
              });
        });
    };
};

async function findAll(req, res) {
    const token = req.headers.authorization;
    const user_auth = await authenticate_user(token);
    if (!user_auth.status) {
        res.send({
            message: user_auth.message
        });
        return;
    };

    Notes.findAll({
        attributes: ['id', 'title'],
        where: {username: user_auth.message}
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error while getting all notes!"
          });
    });
};

export { create, findOne, update, deleteOne, findAll };