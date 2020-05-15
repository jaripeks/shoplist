const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

//mongoose stuff here

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(middleware.requestLogger)

//routes here

app.use(middleware.unknownEndpoint)

module.exports = app