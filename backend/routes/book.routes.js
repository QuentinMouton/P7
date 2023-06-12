const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth.middleware.js')
const multer = require('../middleware/multer-config.middleware')
const bookCtrl = require('../controllers/book.controllers')

router.get('/', bookCtrl.getAllBook)
router.get('/:id', bookCtrl.getOneBook)
router.post('/', auth, multer, bookCtrl.createBook)
router.delete('/:id', auth, bookCtrl.deleteBook)
// router.get('/bestrating', bookCtrl.)
router.put('/:id', auth, multer, bookCtrl.modifyBook)
// router.post('/:id/rating', auth, bookCtrl.)

module.exports = router;