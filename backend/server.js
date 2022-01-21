const experss = require("express");
const bodyParser = require("body-parser");
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const app = experss();
app.use(bodyParser.json());

const db = require('./app/models');
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});