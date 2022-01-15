const express = require('express');
const methodOverride =  require('method-override');


const psqlDb = require('./triggerFunctions');
const pageRender = require('./pageFunctions');

const PORT = 7000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', pageRender.homePage)
app.get('/about', pageRender.aboutPage);
app.get('/edit', pageRender.editPage);

app.get('/triggers', psqlDb.getAllTriggers);
app.get('/triggers/:uuid', psqlDb.getOneTrigger);
app.post('/triggers', psqlDb.postTrigger);
app.put('/triggers/:uuid', psqlDb.putTrigger);
app.delete('/triggers/:uuid', psqlDb.deleteTrigger);

app.post('/test', (req, res) => {
    console.log("POST Request to /test")
    console.log(req.body)
    res.redirect("/")
});

app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`);
});