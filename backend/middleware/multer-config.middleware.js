const multer = require('multer')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

//Donne la destination de l'image et remplace les espaces par "_"
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const bookObject = JSON.parse(req.body.book)
        const title = bookObject.title
        const name = title.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + '_' + Date.now() + extension)
    }
})

module.exports = multer({ storage }).single('image')