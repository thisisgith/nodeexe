const express = require('express');
const router = express.Router();
const {validate, Genre} = require('../models/genres');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * Used to return all genres
 */
router.get('/', async (req,res) => {
    try {
        const genres = await Genre.find().sort("name");
        res.send(genres);
    } catch(err) {
        res.status(500).send(err.message)
    }
});

/**
 * Used to return specfic genre
 */
router.get('/:id', async (req,res) => {
    const id = req.params.id;

    try {
        const genre = await Genre.findById(id);
        if(!genre) {
            return res.status(404).send('genre is not available');
         }
         res.send(genre);
    } catch(err) {
        res.status(500).send(err.message)
    }    
});

/**
 * Used to add specfic genre
 */
router.post('/', auth, async (req,res) => {

    const { error } = validate(req.body) ;

    if ( error ) {
        return res.status(400).send( error.details[0].message)
    }
    
    try {
        const genre = new Genre( {
            name : req.body.name
        });
        
        await genre.save();
        res.send(genre);

    } catch(err) {
        res.status(500).send(err.message)
    }    
});

/**
 * Used to update specfic genre
 */
router.put('/:id', auth, async (req,res) => {

    const id = req.params.id;
    const { error } = validate(req.body) ;
    if ( error ) {
        return res.status(400).send( error.details[0].message)
    }

    try {
        const genre = await Genre.findById(id);
        if(!genre) {
            return res.status(404).send('genre is not available');
         }

         genre.set({name: req.body.name});

         await genre.save();

         res.send(genre);
        } catch(err) {
        res.status(500).send(err.message)
    }   
});

/**
 * Used to update specfic genre (using patch--- to be used only if small things to be updated)
 */
router.patch('/:id', auth, async (req,res) => {

    const id = req.params.id;
    const { error } = validate(req.body) ;
    if ( error ) {
        return res.status(400).send( error.details[0].message)
    }

    try {
        const genre = await Genre.findById(id);
        if(!genre) {
            return res.status(404).send('genre is not available');
         }

         genre.set({name: req.body.name});

         await genre.save();

         res.send(genre);
        } catch(err) {
        res.status(500).send(err.message)
    }   
});

/**
 * Used to delete specfic genre
 */
router.delete('/:id', [ auth, admin], async (req,res) => {

    const id = req.params.id;
    try {
        const genre = await Genre.findByIdAndDelete(id);
        if(!genre) {
            return res.status(404).send('genre is not available');
         }
         res.send(genre);
        } catch(err) {
        res.status(500).send(err.message)
    }   
});

module.exports = router;
