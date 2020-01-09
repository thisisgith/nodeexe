const express = require('express');
const router = express.Router();
const { User } = require('../models/users');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');

//authenticating the user
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send('Invalid Email or Password!!!');

        const validPassword = await bcrypt.compare(req.body.password,user.password);
        if(!validPassword)
            return res.status(400).send('Invalid Email or Password!!!');

        const token = user.generateAuthToken();;
        return res.send(token);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

function validate(body) {
    const schema = Joi.object({
        email: Joi.string().required().max(50).min(5).email(),
        password: Joi.string().required().max(50).min(5),
    });

    return schema.validate(body);
}

module.exports = router;