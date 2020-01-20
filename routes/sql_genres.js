const db = require('../util/mysql_database');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const  {validate} = require('../models/genres');

router.get('/',async (req,res) => {
    try {
        const [genres,fielddata] = await db.execute('Select * from genres');
        res.send(genres);
        return 
    } catch (err) {
        res.status(500).send('!!!Internal Server Problem!!!');    
    }

});

router.get('/:id',auth ,async (req,res) => {
    const id = req.params.id;
    try {
        const [genre] = await db.execute('Select * from genres where id = ?',[id]);
        if(genre.length === 0)
            return res.status(404).send('Genre is not Available');
        res.send(genre);
    } catch (err) {
        res.status(500).send('!!!Internal Server Problem!!!');    
    }
});

router.post('/',auth ,async (req,res) => {
    const {error} = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
    try {
        const [genre] = await db.execute('insert into genres (name) values (?)',[req.body.name]);
        res.send(genre);
    } catch (err) {
        res.status(500).send('!!!Internal Server Problem!!!');    
    }
});


router.put('/:id',auth ,async (req,res) => {
    const {error} = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
    const id = req.params.id;
    try {
        const [genre] = await db.execute('update genres set name = ? where id=?',[req.body.name,id]);
        if(genre.affectedRows === 0){
            return res.status(404).send('Genre is not Available')
        }
        res.send(genre);
    } catch (err) {
        res.status(500).send('!!!Internal Server Problem!!!');    
    }
});

router.delete('/:id',[auth,admin] ,async (req,res) => {
    const id = req.params.id;
    try {
        const [genre] = await db.execute('delete from genres where id= ?',[id]);
        if(genre.affectedRows === 0){
            return res.status(404).send('Genre is not Available')
        }
        res.send(genre);
    } catch (err) {
        res.status(500).send('!!!Internal Server Problem!!!');    
    }
});
module.exports = router;