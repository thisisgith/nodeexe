const {Genre, validate} = require('../models/squ-genres');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, async (req, res) => {
    try {
        const genres = await Genre.findAll({
            attributes: ['id', 'name']
        });
        res.send(genres);
    } catch (err) {
        res.status(500).send(err.message);
    }

});


//Changed this get request to check how to use methods created using sequelize model
router.get('/:id', auth,async (req,res) => {
    const id = req.params.id;
    try {
        const genre = await Genre.findByPk(id,{
            attributes: ['id','name']
        });
        if(!genre)
            return res.status(404).send("!!!Genre not Available!!!");
        res.send(genre.getIdandName()); // method created using sequelize method , which can be used for token generation
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', auth, async(req, res) => {
    const {error} = validate(req.body);
    if(error) 
        return res.status(400).send(error.details[0].message);
    
    try {
        const genre = Genre.build({
            name: req.body.name
        })

        await genre.save();

        res.send(genre);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', auth, async(req, res) => {
    const id = req.params.id;
    const {error} = validate(req.body);
    if(error) 
        return res.status(400).send(error.details[0].message);
    
    try {
        const genre = await Genre.findByPk(id);
        if(!genre)
            return res.status(404).send("!!!Genre not Available!!!");

        genre.set({
            name: req.body.name
        });

        await genre.save();

        res.send(genre);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', [auth, admin],async (req,res) => {
    const id = req.params.id;
    try {
        const genre = await Genre.findByPk(id);
        if(!genre)
            return res.status(404).send("!!!Genre not Available!!!");

        await genre.destroy();
        res.send(genre);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;