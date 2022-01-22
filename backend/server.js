import experss from "express";
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import db from './app/models/index.js';
import set_note_router from './app/routes/note.js';
import set_user_router from './app/routes/user.js'
import bodyParser from "body-parser";
import cors from 'cors';

var corsOptions = {
    origin: "http://localhost:3000"
  };

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({path: resolve(__dirname, '../.env')});

const app = experss();
app.use(cors(corsOptions));
app.use(bodyParser.json());

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });
db.sequelize.sync();

set_note_router(app);
set_user_router(app);

const PORT = process.env.BACKEND_PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});