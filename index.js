const express = require('express');
const db = require('./triggerFunctions');

const port = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/triggers', db.getAllTriggers);
app.get('/triggers/:uuid', db.getOneTrigger);
app.post('/triggers', db.postTrigger);
app.put('/triggers/:uuid', db.putTrigger);
app.delete('/triggers/:uuid', db.deleteTrigger);

app.listen(port, () => {
    console.log(`App running on port: ${port}`)
});