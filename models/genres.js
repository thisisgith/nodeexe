const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema( {
    name : {
        type: String,
        minlength: 4,
        maxlength: 30,
        required: true
    },
})

const Genre = mongoose.model('genre',genreSchema,'genres');

function validate(body) {
    const schema =  Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
    });

    return schema.validate(body)
}

module.exports = {
    validate,
    Genre,
    genreSchema
};