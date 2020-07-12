const express = require('express');
const app = express();
const mongoose = require('mongoose');

// connect the mongodb database
mongoose.connect('mongodb://localhost:27017/mern-boilerplate', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log('Database is connected'))
    .catch((error) => console.error(error));

app.get('/', (req, res) => {
    res.send('Hello world');
});

// port to listen
app.listen(5000);