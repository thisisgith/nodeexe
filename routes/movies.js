const express = require('express');
const router = express.Router();
const { Movie,validate } = require('../models/movies');
const { Genre } = require('../models/genres');
const auth = require('../middleware/auth');

router.get('/', async (req,res) => {
    try {
        const movies = await Movie.find();
        res.send(movies);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', async (req,res) => {
    const id = req.params.id;
    try {
        const movie = await Movie.findById(id);
        if(!movie)
            res.status(404).send('Movie not available');
        res.send(movie);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
        
    try {
        const genre = await Genre.findById(req.body.genreId);

        if(!genre)
            res.status(404).send('Genre not available');

        const movie = new Movie({
            genre: {
                _id: genre._id,
                name: genre.name
            },
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        await movie.save();
        res.send(movie);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', auth, async (req,res) => {
    const id = req.params.id;
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
        
    try {
        const movie = await Movie.findById(id);
        if(!movie)
            res.status(404).send('Movie not available');

        movie.set({
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        await movie.save();
        res.send(movie);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', auth, async (req,res) => {
    const id = req.params.id;        
    try {
        const movie = await Movie.findByIdAndDelete(id);
        if(!movie)
            res.status(404).send('Movie not available');
        res.send(movie);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;