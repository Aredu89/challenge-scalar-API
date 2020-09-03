const express = require('express');
const bodyParser= require('body-parser');
const cors = require('cors')
const app = express();
require('./model/db')

app.use(bodyParser.json())
const apiRouter = require('./router/router')

app.use(cors())
app.use('/api', apiRouter)

app.listen(process.env.PORT || 8080, function() {
  console.log('listening on 8080')
})