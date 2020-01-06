const express = require('express');
const app = express();
const genres = require('./routes/genres');

//used to parse the body
app.use(express.json());

app.get('/',(req,res) => {
    res.send("Welcome to Practice Session");
});

//import the custom routes
app.use('/api/genres/',genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port : ${port}`));