const mongoose = require( 'mongoose' )

const users = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  permits: {
    type: String,
    enum: ['admin', 'user']
  }
})

mongoose.model('Users', users)