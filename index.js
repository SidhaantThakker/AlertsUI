const express = require('express');
const methodOverride =  require('method-override');


const db = require('./triggerFunctions');

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/triggers', db.getAllTriggers);
app.get('/triggers/:uuid', db.getOneTrigger);
app.post('/triggers', db.postTrigger);
app.put('/triggers/:uuid', db.putTrigger);
app.delete('/triggers/:uuid', db.deleteTrigger);

app.listen(port, () => {
    console.log(`App running on port: ${PORT}`);
});