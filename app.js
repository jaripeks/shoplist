const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
//const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

//mongoose stuff here

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

//routes here

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app