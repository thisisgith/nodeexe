const { FileUpload, validate } = require('../models/squ-file-upload');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fs = require('fs');

router.get('/', async (req, res) => {
    try {
        const files = await FileUpload.findAll({
            attributes: ['id', 'name', 'filePath']
        });
        res.send(files);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//We are writing this method to download a file
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const file = await FileUpload.findByPk(id, {
            attributes: ['id', 'name', 'filePath']
        });

        if (!file) {
            return res.status(400).send('Data not Available');
        }

        const filePath = file.filePath;

        //readFile method is usefull if the size is small, if file is big then memory will overflow
        // fs.readFile(filePath, (err,data) =>{
        //     if(err)
        //         return res.status(400).send(err);
        //     else
        //     res.setHeader('Content-Type','image/png');  
        //     res.setHeader('Content-Disposition','attachment; filename="sample.png"');
        //     return res.send(data);

        // });

        // To read file of large size, we should stream the response using createReadStream method
        const image = fs.createReadStream(filePath);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="sample.png"');
        image.pipe(res);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    const image = req.file;
    if (!image)
        return res.status(400).send("Attached File is not an Image");

    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        const filePath = image.path.replace("\\", "/");
        const file = FileUpload.build({
            name: req.body.name,
            filePath: filePath
        });
        await file.save();

        res.send(file);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//We are writing this method to download a file
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const file = await FileUpload.findByPk(id, {
            attributes: ['id', 'name', 'filePath']
        });

        if (!file) {
            return res.status(400).send('Data not Available');
        }

        const filePath = file.filePath;
        fs.unlink(filePath, (err) => {
            if (err) {
                return next(err);
            }
            
           file.destroy();
           res.send(file);
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;