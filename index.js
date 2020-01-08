const express = require('express');
const app = express();
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');

//connect to mongodb database
mongoose.connect('mongodb://localhost:27017/playground',{ useUnifiedTopology: true,useNewUrlParser: true })
    .then(() => console.log('connected to playground database'))
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

// Port assignment statement
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port : ${port}`));