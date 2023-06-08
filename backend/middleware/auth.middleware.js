const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try{
        const token = req.header.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, '36?8CkUcikg7dLY?stj75AjKskcUhWBFz8V8ad8DEF=NcaoRaBNn6WnpD7d4V-LS!LH6lkP9=-klaLp!7buyX1Okq3hwItTZkmOdeuRj8gN3PiLdcmaB3Ft6YRv==b5Qai/LlYynkNMClKNOV0kpK!rT5OmAPahFSbSKIRwI!i67YjElXP!Nx6V3nAy0SN8xikrzamV3kJZsq/f9o5trdBi!sRkFwyiMT6GoYOSAWS4sRXTHFTiUdn/B3WsXS-EA')
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
    } catch(error){
        res.status(401).json({ error })
    }

}