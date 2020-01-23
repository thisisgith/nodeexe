const { User, validate } = require('../models/squ-users');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email'],
        });

        res.send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByPk(id, {
            attributes: ['id', 'name', 'email']
        });
        if (!user)
            return res.status(404).send("!!!User not Available!!!");
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        const user = User.build({
            name: req.body.name,
            email: req.body.email,
        })

        await user.save();

        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        const user = await User.findByPk(id);
        if (!user)
            return res.status(404).send("!!!User not Available!!!");

        user.set({
            name: req.body.name,
            email: req.body.email,
        });

        await user.save();

        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (!user)
            return res.status(404).send("!!!User not Available!!!");

        await user.destroy();
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;