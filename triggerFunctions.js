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

const getAllTriggers = (req, res) => {

    console.log(`GET Request for All Triggers`)

    pool.query('SELECT * FROM triggers ORDER BY created_at DESC', (err, data) => {
        if (err) {
            throw err;
        }
        res.status(200).json(data.rows);
    });
}
  
const getOneTrigger = (req, res) => {

    const uuid = req.params.uuid;

    console.log(`GET Request for Trigger with UUID: ${uuid}`)

    pool.query('SELECT * FROM triggers WHERE uuid = $1', [uuid], (err, data) => {
        if (err) {
            throw err;
        }
        res.status(200).json(data.rows);
    });
}

const postTrigger = (req, res) => {

    const uuid = uuidv4();
    let {
        user_id,
        name,
        status,
        disabled_reason,
        lhs_attribute,
        lhs_exchange,
        lhs_tradingsymbol,
        operator,
        rhs_type,
        rhs_constant,
        rhs_attribute,
        rhs_exchange,
        rhs_tradingsymbol
    } = req.body;

    if(rhs_constant == ""){
        rhs_constant = "0.0"
    }
    
    pool.query(`INSERT INTO triggers (uuid, user_id, name, created_at, status, disabled_reason, lhs_attribute, lhs_exchange, 
    lhs_tradingsymbol, operator, rhs_type, rhs_constant, rhs_attribute, rhs_exchange, rhs_tradingsymbol)
    VALUES ($1, $2, $3, (to_timestamp(${Date.now()} / 1000.0)), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`, 
    [
    uuid, 
    user_id, 
    name,  
    status,
    disabled_reason,
    lhs_attribute,
    lhs_exchange,
    lhs_tradingsymbol,
    operator,
    rhs_type,
    rhs_constant,
    rhs_attribute,
    rhs_exchange,
    rhs_tradingsymbol
    ], (err, data) => {
        if (err) {
            throw err;
        }
        console.log(data)
        res.status(201).send(`Trigger added with UUID : ${data.rows[0].uuid}`)
    });
}

const putTrigger = (req, res) => {

    const uuid = req.params.uuid

    console.log(`PUT Request for Trigger with UUID: ${uuid}`)

    let { 
        user_id,
        name,
        status,
        disabled_reason,
        lhs_attribute,
        lhs_exchange,
        lhs_tradingsymbol,
        operator,
        rhs_type,
        rhs_constant,
        rhs_attribute,
        rhs_exchange,
        rhs_tradingsymbol 
    } = req.body;

    if(rhs_constant == ""){
        rhs_constant = "0.0"
    }
    

    pool.query(`UPDATE triggers SET updated_at = (to_timestamp(${Date.now()} / 1000.0)), user_id = $2, name = $3, status = $4,
    disabled_reason = $5, lhs_attribute = $6, lhs_exchange = $7, lhs_tradingsymbol = $8, operator = $9, 
    rhs_type = $10, rhs_constant = $11, rhs_attribute = $12, rhs_exchange = $13, rhs_tradingsymbol = $14 WHERE uuid = $1`, 
    [
    uuid, 
    user_id, 
    name,
    status,
    disabled_reason,
    lhs_attribute,
    lhs_exchange,
    lhs_tradingsymbol,
    operator,
    rhs_type,
    rhs_constant,
    rhs_attribute,
    rhs_exchange,
    rhs_tradingsymbol
    ], (err, data) => {
        if (err) {
            throw err;
        }
        res.status(200).send(`Trigger modified with UUID: ${uuid}`);
    });
}

const deleteTrigger = (req, res) => {

    const uuid = req.params.uuid

    console.log(`DELETE Request for Trigger with UUID: ${uuid}`)

    pool.query('DELETE FROM triggers WHERE uuid = $1', [uuid], (err, data) => {
        if (err) {
            throw err;
        }
        res.status(200).send(`Trigger deleted with UUID: ${uuid}`);
    });
}

module.exports = {
    getAllTriggers,
    getOneTrigger,
    postTrigger,
    putTrigger,
    deleteTrigger,
}