const logger = require('./logger')

const requestLogger = (request, response, next) => {
	logger.info(`method: ${request.method} | path: ${request.path}`)
	logger.info(`body: ${JSON.stringify(request.body)}`)
	logger.info('------------')
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	// mongo schema errors cause ValidationError
	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	// wrong (non-existing) mongo-id causes CastError
	if (error.name === 'CastError') {
		return response.status(404).json({ error: error.message })
	}

	logger.error(error.message)

	next(error)
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler
}