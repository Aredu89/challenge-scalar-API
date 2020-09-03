const mongoose = require( 'mongoose' )

const comments = new mongoose.Schema({
	user: String,
	rate: {
		type: Number,
		enum: [1,2,3,4,5]
	},
	comment: String
})

const movies = new mongoose.Schema({
	title: {
		type: String,
		maxlength: 255,
		required: true
	},
	year: {
		type: Number,
		default: 2020
	},
	rated: Number,
	rates: [comments],
	details: String,
	release_on: Date,
	genre: String,
	director: String,
	plot: String,
	created_at: {
		type: Date,
		default: new Date()
	},
	updated_at: Date,
})

mongoose.model('Movies', movies)