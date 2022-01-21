import { DB, USER, PASSWORD, HOST, dialect as _dialect } from '../config/db.js';
import Sequelize from 'sequelize';
import create_note_model from './note.js';

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

export default db;