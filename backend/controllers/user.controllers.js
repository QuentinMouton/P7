const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User.model')

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
                            '36?8CkUcikg7dLY?stj75AjKskcUhWBFz8V8ad8DEF=NcaoRaBNn6WnpD7d4V-LS!LH6lkP9=-klaLp!7buyX1Okq3hwItTZkmOdeuRj8gN3PiLdcmaB3Ft6YRv==b5Qai/LlYynkNMClKNOV0kpK!rT5OmAPahFSbSKIRwI!i67YjElXP!Nx6V3nAy0SN8xikrzamV3kJZsq/f9o5trdBi!sRkFwyiMT6GoYOSAWS4sRXTHFTiUdn/B3WsXS-EA',
                            { expiresIn: '24h' }
                        )
                    })
                }
            })
            .catch(error => res.status(500).json({ error }))
        }
    })
    .catch(error => res.status(400).json({ error }))
}