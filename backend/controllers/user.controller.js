const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

require('dotenv').config()

//Requête pour créer un utilisateur
exports.signUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User ({
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}
//Requête pour connecter l'utilisateur à son compte
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user === null){
            res.status(401).json({ message: 'Identifiant ou mot de passe incorrecte'})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid){
                    res.status(401).json({ message: 'Identifiant ou mot de passe incorrecte'})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '4h' }
                        )
                    })
                }
            })
            .catch(error => res.status(500).json({ error }))
        }
    })
    .catch(error => res.status(400).json({ error }))
}