const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true
    },
    name : {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    phone: {
        type: String,
        minlength: 10,
        maxlength: 10,
        required: true
    }
});

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 10,
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

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: moviesSchema,
        required:true
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        required: false,
        min: 1,
        max: 5000
    }
});

const Rental = mongoose.model('rental',rentalSchema,'rentals');

function validate(body) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });

    return schema.validate(body);
}

module.exports = {
    Rental,
    validate
}