const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const helmet = require('helmet');
const compression = require('compression');

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

//for production security we use this packages
app.use(helmet());
app.use(compression());

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

//used to parse the body
app.use(express.json());

app.get('/',(req,res) => {
    res.send("Welcome to Practice Session");
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

//Sync method is used to create the tables automatically in sequelize if they dont exist
sequelize.sync().then().catch((err)=>console.log(err));

// Port assignment statement
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port : ${port}`));