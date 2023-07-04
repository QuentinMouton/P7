const fs = require('fs')

const Book = require('../models/book.model')

//Requête pour récupérer tous les livres
exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json( books ))
    .catch(err => res.status(400).json({ err }))
}
//Requête pour récupérer les 3 livres les mieux notés
exports.getBestBook = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json( books ))
    .catch(err => res.status(400).json({ err }))
}
//Requête pour récupérer un livre
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json( book ))
    .catch((err) => res.status(400).json({ err }))
}
//Requête pour ajouter une note à un livre
exports.rateBook = (req, res, next) => {
    const user = req.body.userId
    Book.findOne({ _id: req.params.id })
    .then(book => {
        if (book.ratings.find(rating => rating.userId === user)) {
            res.status(401).json({ message: 'Livre déjà noté'})
        } else {
            const newRating = {
                userId: user,
                grade: req.body.rating,
            }
            const updatedRatings = [
                ...book.ratings,
                newRating
            ]
            const calcAverageRating = (ratings) => {
                const sum = ratings.reduce((total, rate) => total + rate.grade, 0)
                const average = sum / ratings.length
                return parseFloat(average.toFixed(2))
            }
            const updateAverageRating = calcAverageRating(updatedRatings)
            Book.findOneAndUpdate(
                {_id: req.params.id, 'ratings.userId': { $ne: user }},
                { $push: { ratings: newRating }, averageRating: updateAverageRating },
                { new: true }
            )
            .then(updatedBook => res.status(201).json( updatedBook ))
            .catch(err => res.status(401).json({ err }))
        }
    })
    .catch(err => res.status(401).json({ err }))
}
//Requête pour ajouter un livre à la base de données
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject._userId
    const book = new Book ({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp`,
        averageRating: bookObject.ratings[0].grade
    })
    book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(err => res.status(500).json({ err }))
}
//Requête pour modifier un livre
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp`
    } : { ...req.body }
    delete bookObject._userId
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        if (!book || !book.userId == req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé' })
        } else {
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre modifié' }))
            .catch(err => res.status(401).json({ err }))
        }
    })
    .catch(err => res.status(400).json({ err }))
}
//Requête pour supprimer un livre de la base de données
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then( book => {
        if (!book || !book.userId == req.auth.userId){
            res.status(401).json({ message: 'Non autorisé' })
        } else {
            const filename= book.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Livre supprimé' }))
                .catch(err => res.status(401).json({ err }))
            })
        }
    })
    .catch(err => res.status(500).json({ err }))
}