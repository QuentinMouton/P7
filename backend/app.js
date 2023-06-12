const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes')
const bookRoutes = require('./routes/book.routes')

const path = require('path');
const app = express()

require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.ajujwk7.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(express.json())
app.use('/api/auth', userRoutes)
app.use('/api/books', bookRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;