const express = require('express')
const router = express.Router()

//Controllers
const movies = require('../controllers/movies.js')

//---------Routing------------
//Movies
router.get('/movies', movies.getAllMovies)
router.get('/movies/:id', movies.getMovieById)
router.put('/movies/:id', movies.updateMovie)
router.post('/movies', movies.createMovie)
router.delete('/movies/:id', movies.deleteMovie)

module.exports = router