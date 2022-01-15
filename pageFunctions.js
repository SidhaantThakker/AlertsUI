const Pool = require('pg').Pool;
const { v4: uuidv4 } = require('uuid'); 
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'isec-alerts-triggers',
    password: process.env.PASSWORD,
    port: 5432
});

const homePage = (req, res) => {

    console.log('Get request to /');

    pool.query('SELECT * FROM triggers ORDER BY created_at DESC', (err, data) => {
        if (err) {
            throw err;
        }
        res.render('pages/index',  {
            triggers: data.rows
        })
    });
}

const aboutPage = (req, res) => {

    console.log('GET Request to /about');

    res.render('pages/about');
}

const editPage = (req, res) => {
    const uuid = req.query.uuid;
    console.log(`GET Request to /edit with UUID: ${uuid}`)
    pool.query('SELECT * FROM triggers WHERE uuid = $1', [uuid], (err, data) => {
        if (err) {
            throw err;
        }
        console.log(data.rows[0])
        res.render('pages/edit', {
            trigger: data.rows[0]
        });

    });
}


module.exports = {
    homePage,
    aboutPage,
    editPage
}