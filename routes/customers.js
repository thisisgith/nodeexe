const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customers');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// used to return all customers
router.get('/', async (req,res) => {
    try {
        const customers = await Customer.find().sort('name');
        res.send(customers);
    } catch (err) {
        res.status(500).send(err.message)
    }
});

// used to return specific customers
router.get('/:id', async (req,res) => {
    try {
        const id = req.params.id;
        const customer = await Customer.findById(id);
        if(!customer)
            return res.status(404).send('customer not available');
        res.send(customer);
    } catch (err) {
        res.status(500).send(err.message)
    }
});

// used to add customers
router.post('/', auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message)
    try {
        const customer =new Customer({
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        });
        await customer.save();
        res.send(customer);
    } catch (err) {
        res.status(500).send(err.message)
    }
});

// used to update specific customers
router.put('/:id', auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message)
    try {
        const id = req.params.id;
        const customer = await Customer.findById(id);
        if(!customer)
            return res.status(404).send('customer not available');
        customer.set({
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        });
        await customer.save();
        res.send(customer);
    } catch (err) {
        res.status(500).send(err.message)
    }
});

// used to delete specific customers
router.delete('/:id', [ auth, admin], async (req,res) => {
    try {
        const id = req.params.id;
        const customer = await Customer.findByIdAndRemove(id);
        if(!customer)
            return res.status(404).send('customer not available');
        res.send(customer);
    } catch (err) {
        res.status(500).send(err.message)
    }
});

module.exports = router;