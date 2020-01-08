const express = require('express');
const router = express.Router();
const { Rental, validate } = require('../models/rentals');
const { Customer } = require('../models/customers');
const { Movie } = require('../models/movies');
const Fawn = require('fawn');
const mongoose = require('mongoose');
Fawn.init(mongoose);

router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort('-dateOut');
        res.send(rentals);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const rental = await Rental.findById(id);
        if (!rental) {
            return res.status(400).send('Rental not available');
        }
        res.send(rental);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        const customerId = req.body.customerId;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(400).send('customer not available');
        }

        const movieId = req.body.movieId;
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(400).send('movie not available');
        }

        const rental = new Rental({
            customer: {
                _id: customer._id,
                isGold: customer.isGold,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                numberInStock: movie.numberInStock,
                dailyRentalRate: movie.dailyRentalRate
            }
        });

        const fawn = new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: {
                    numberInStock: -1
                }
            })
            .run();

        res.send(rental);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;