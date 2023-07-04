const jwt = require('jsonwebtoken')

require('dotenv').config()

//Vérification de l'authenticité du token
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.TOKEN)
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch(err){
        res.status(403).json({ err })
    }
}