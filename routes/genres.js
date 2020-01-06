const express = require('express');
const router = express.Router();
const validate = require('../models/genres');

let genres = [
    { id: 1, name: 'action'},
    { id: 2, name: 'thriller'},
    { id: 3, name: 'comedy'},
];

/**
 * Used to return all genres
 */
router.get('/', (req,res) => {
    res.send(genres);
});

/**
 * Used to return specfic genre
 */
router.get('/:id', (req,res) => {
    const id = +req.params.id;
    const genre = genres.find( v => v.id === id);
    if(!genre) {
       return res.status(404).send('genre is not available');
    }
    res.send(genre);
});

/**
 * Used to add specfic genre
 */
router.post('/', (req,res) => {

    const { error } = validate(req.body) ;

    if ( error ) {
        return res.status(400).send( error.details[0].message)
    }
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    
    genres.push(genre);

    res.send(genre);
});

/**
 * Used to update specfic genre
 */
router.put('/:id', (req,res) => {

    const id =  +req.params.id;
    const genre = genres.find( v => v.id === id);
    if(!genre) {
       return res.status(404).send('genre is not available');
    }

    const { error } = validate(req.body) ;
    if ( error ) {
        return res.status(400).send( error.details[0].message)
    }

    genre.name = req.body.name;

    res.send(genre);
});

/**
 * Used to delete specfic genre
 */
router.delete('/:id', (req,res) => {

    const id = +req.params.id;
    const index = genres.findIndex( v => v.id === id);
    if(index < 0) {
       return res.status(404).send('genre is not available');
    }

    const genre = genres.splice(index,1);
    
    res.send(genre);
});

module.exports = router;
