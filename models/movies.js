const mongoose = require('mongoose');
const { genreSchema } = require('./genres');
const Joi = require('@hapi/joi');

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 10,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 1,
        max: 50,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 1,
        max: 50,
        required: true
    }
});

const Movie = mongoose.model('movie', moviesSchema, 'movies');

function validate(body) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(10).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(1).max(50).required(),
        dailyRentalRate: Joi.number().min(1).max(50).required()
    });

    return schema.validate(body);
}

module.exports = {
    moviesSchema,
    Movie,
    validate
}