const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const listsRouter = require('./controllers/lists')
const itemsRouter = require('./controllers/items')
const usersRouter = require('./controllers/users')

//mongoose stuff here
logger.info('Connecting to Mongo')
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(() => logger.info('Connected to Mongo'))
	.catch(error => logger.error(`error with Mongo - ${error.message}`))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

//routes here
app.use('/api/users', usersRouter)
app.use('/api/lists', listsRouter)
app.use('/api/items', itemsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app