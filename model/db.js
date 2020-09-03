const mongoose = require('mongoose')

const dbURI = 'mongodb+srv://Aredu:Karenyariel@cluster0-niikj.gcp.mongodb.net/dbdesafio?retryWrites=true&w=majority'

mongoose.connect(dbURI,{ 
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//Mensajes
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + dbURI)
})
mongoose.connection.on('error',(err) => {
  console.log('Mongoose connection error: ' + err)
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected')
})

require('./movies.js')
require('./users.js')