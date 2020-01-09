const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/users');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//Registering the new user
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).send('User already Registered');

        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        res.send(_.pick(user, ['_id', 'name', 'email']));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;