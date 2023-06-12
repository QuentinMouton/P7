const sharp = require('sharp')
const fs = require('fs')

const optimizedImg = async (req, res, next) => {
    try{
        await sharp(req.file.path)
            .resize({ width: 350, height: 500 })
            .webp({ quality: 80 })
            .toFile(`${req.file.path}.webp`)

        fs.unlink(req.file.path, (err) => {
                req.file.path = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                if (err){
                    (() => res.status(500).json({ err: 'Impossible de supprimer le fichier' }))
                }
            })
        next()
    } catch (error){
        error => res.status(500).json({ error })
    }

}

module.exports = optimizedImg