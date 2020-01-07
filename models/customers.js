const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

//For practice we have implement the custom validator and in-built validator, else it is not required.
const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true
    },
    name : {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: function() {
            return this.isGold;
        }
    },
    phone: {
        type: String,
        validate : {
            validator: function(v) {
                return v.length === 10;
            },
            message :"phone number must be 10 numbers"
        },
        required: true
    }
});

const Customer = mongoose.model('customer', customerSchema, 'customers');

function validate( body ) {
    const schema = Joi.object({
        isGold: Joi.boolean().required(),
        name: Joi.string().min(3).max(30).optional(),
        phone: Joi.string().min(3).max(30).optional()
    });

    return schema.validate(body);
}

module.exports = {
    Customer,
    validate
}