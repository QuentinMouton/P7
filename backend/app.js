const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes')

const app = express()

async function main() {
    await mongoose.connect('mongodb+srv://admin:Uo^SSzPLFA*9URj6Fut$J3o$3XeUkEa$N9k$aJwu@atlascluster.ajujwk7.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
}
main()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(express.json())
app.use('/api/auth', userRoutes)

module.exports = app;