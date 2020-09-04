const mongoose = require('mongoose')
const Movies = mongoose.model('Movies')

//List of movies
module.exports.getAllMovies = (req, res) => {
    // const user = JSON.parse(req.headers.user)
    Movies
        .find({})
        .exec((err, results, status) => {
            if(!results || results.length < 1){
                res.status(200).json([])
            } else if (err) {
                res.status(404).json(err)
            } else {
                res.status(200).json(results)
            }
        })
}

//get one movie
module.exports.getMovieById = (req, res) => {
    if (req.params && req.params.id) {
        Movies
        .findById(req.params.id)
        .exec((err, movie) => {
						//If the id doesn´t exist
            if (!movie) {
							res.status(404).json({ message: "Id not found"})
						//If there is an error
            } else if (err) {
							res.status(404).json(err)
            } else {
                //Document found
                res.status(200).json(movie)
            }
        })
    } else {
        res.status(404).json({ message: "The Id is not given"})
    }
}

//Create a movie
module.exports.createMovie = (req, res) => {
  const bodyMovie = req.body
  // Checking if the movie already exists
  Movies
    .findOne({ title: bodyMovie.title })
    .then(movie=>{
      if(movie){
        res.status(400).json({message: "The movie already exists"})
      } else {
        //We create the movie
        Movies
          .create(bodyMovie, (err, movie) => {
            if(err) {
              res.status(400).json(err)
            } else {
              res.status(201).json(movie)
            }
          })
      }
    })
  
}

//Update a movie
module.exports.updateMovie = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "We need the Id"})
    return
  }
  const bodyMovie = req.body
  Movies
    .findById(req.params.id)
    .select('-created_at')
    .exec(
      (err,movie) => {
        if (!movie) {
          res.status(404).json({ message: "We didn´t find the movie"})
          return
        } else if (err) {
          res.status(404).json(err)
          return
        }
				//replace the data from the body
				for(let key of Object.keys(bodyMovie)){
					if(key !== 'rates'){
						movie[key] = bodyMovie.key
					}
				}
				//Adding a new rate, if there is some
				if(bodyMovie.rates){
					if(bodyMovie.rates.length > 0){
						bodyMovie.rates.forEach(rt=>{
							if(!movie.rates){
								movie.rates = []
							}
							movie.rates.push(rt)
						})
					}
				}
				//Calculate de rated
				if(movie.rates){
					if(movie.rates.length > 0){
						let total = 0
						movie.rates.forEach(mov=>{
							total = total + mov.rate
						})
						const avg = total/movie.rates.length
						movie.rated = Math.round(avg)
					}
				}
				movie.updated_at = new Date()
				//Save the updated movie
        movie.save((err, movie) => {
          if (err) {
            res.status(404).json(err)
          } else {
            res.status(201).json(movie)
          }
        })
      }
    )
}

//Delete movie
module.exports.deleteMovie = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "We need the id"})
    return
  }
  Movies
    .findByIdAndRemove(req.params.id)
    .exec(
      (err, movie) => {
        if(err){
          res.status(404).json(err)
        } else {
          res.status(204).json(movie)
        }
      }
    )
}