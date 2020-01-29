const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const uuidv4 = require('uuid/v4')

const sequelize = require('./util/seq-database');

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const sqlGenres = require('./routes/sql-genres');
const squGenres = require('./routes/squ-genres');
const squProducts = require('./routes/squ-products');
const squUsers = require('./routes/squ-users');
const squFileUpload = require('./routes/squ-file-upload');
const errorHandler = require('./middleware/erro-handler');

// To create Association we are importing this
const {Product} = require('./models/squ-products');
const {User} = require('./models/squ-users');


//env variable checking
if(!config.get('jwtPrivateKey') || !config.get('db')) {
    console.error("FATAL Error : jwtPrivateKey or db is not set");
    process.exit(1);
}

const db = config.get('db');
//connect to mongodb database
mongoose.connect(db,{ useUnifiedTopology: true,useNewUrlParser: true })
    .then(() => console.log(`connected to ${db}`))
    .catch((err) => console.log(err))

//for production security we use this packages
app.use(helmet());
app.use(compression());

//used to parse the body
app.use(express.json());

//Setting storage options for multer
const fileStorage = multer.diskStorage({
    destination: (_req,_file, cb) =>{
        cb(null, 'images');
    },
    filename: (req,file,cb) =>{
        cb(null, uuidv4()+'-'+file.originalname)
    }
});

//Setting filter to restrict the type of file
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
        cb(null,true);
    else 
        cb(null, false);
};
//used to parse the multipart data
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('fileUpload'));

app.get('/',(_req,res) => {
    res.send("Welcome to Practice Session");
});

//Adding the above middle for test the association using sequelize
app.use( async (req, res, next)=> {
    const user = await User.findByPk(1);
    req.squUser = user;
    next();
});

app.use( (_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
//import the custom routes
app.use('/api/genres/', genres);
app.use('/api/movies', movies);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/sqlgenres/', sqlGenres);
app.use('/api/squGenres/', squGenres);
app.use('/api/squProducts', squProducts);
app.use('/api/squUsers', squUsers);
app.use('/api/squfileupload', squFileUpload);
app.use(errorHandler);

//To Create one to many association 
User.hasMany(Product);


//Sync method is used to create the tables automatically in sequelize if they dont exist
sequelize
    .sync()
    // .sync({force: true}) --- to create the tables again
    .then()
    .catch((err)=>console.log(err));


// Port assignment statement
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port : ${port}`));