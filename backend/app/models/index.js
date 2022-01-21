import { DB, USER, PASSWORD, HOST, dialect as _dialect } from '../config/db.js';
import Sequelize from 'sequelize';
import create_note_model from './note.js';
import create_user_model from './user.js';

const sequelize = new Sequelize(
    DB,
    USER,
    PASSWORD,
    {
        host: HOST,
        dialect: _dialect,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.notes = create_note_model(sequelize, Sequelize);
db.users = create_user_model(sequelize, Sequelize);

export default db;