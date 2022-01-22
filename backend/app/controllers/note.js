import db from '../models/index.js';
import { authenticate_user, authenticate_note } from './auth.js';
import cache_cli from '../config/cache-cli.js';

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
    if (title === undefined || content === undefined) {
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
    // validate input
    const id = req.params.id;
    if (!id) {
        res.status(400).send({
            message: 'id is not porvided.'
        });
        return;
      };

    // check token authentication
    const token = req.headers.authorization;
    const user_auth = await authenticate_user(token);
    if (!user_auth.status) {
        res.status(401).send({
            message: user_auth.message
        });
        return;
    };

    // get data from catch if exists
    cache_cli.getKey({
        key: id,
    }, async (error, value) =>{
        if (!error) {
            console.log('get key from cache');
            const title = value.value.split(':')[0];
            const content = value.value.split(':')[1];
            res.send({
                id: id,
                title: title,
                content: content
            });
        } else {
            console.log('get from database');
            const note_auth = await authenticate_note(user_auth.message, id);
            if (!note_auth.status) {
                res.status(note_auth.code).send({
                   message: note_auth.message 
                });
            } else {
                // set data in cache
                cache_cli.setKey({
                    key: note_auth.id,
                    value: note_auth.title + ':' + note_auth.content
                }, (error, value) => {
                    if (!error) {
                        console.error('note added to cache! current cache is: ', value);
                     } else {
                        console.error(error);
                     };
                });
        
                res.send({
                    id: note_auth.id,
                    title: note_auth.title,
                    content: note_auth.content
                });
            };
        };
    });
};

async function update(req, res) {
  const {title, content } = req.body;
  const id = req.params.id;
  if (!id || title === undefined || content === undefined) {
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
            cache_cli.clear({},(error,note) => {
                if (!error) {
                   console.log('Cleared cache.')
                } else {
                   console.error(error)
                };
            })
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