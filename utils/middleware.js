const jwt = require('jsonwebtoken')
const logger = require('./logger')

/**
 * Logs all incoming requests with the logger defined in './logger.js'
 */
const requestLogger = (request, response, next) => {
	logger.info(`method: ${request.method} | path: ${request.path}`)
	logger.info(`body: ${JSON.stringify(request.body)}`)
	logger.info('------------')
	next()
}

/**
 * Handles incoming HTTP-requests to endpoints
 * that do not have an express.Router() route defined
 */
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

/**
 * Handles some known errors of the app and creates proper HTTP-statuses and error messages for those
 * Logs unknown errors with the logger and calls the default node error-handler with them
 */
const errorHandler = (error, request, response, next) => {
	// mongo schema errors cause ValidationError
	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	// wrong (format) mongo-id causes CastError
	if (error.name === 'CastError') {
		return response.status(404).json({ error: error.message })
	}

	logger.error(error.message)

	next(error)
}

/**
 * Gets the Authorization header content from the request and returns the content with the 'bearer ' string removed
 * Sets the found token to request.token
 */
const tokenExtractor = (request, response, next) => {
	const auth = request.get('authorization')
	if(auth && auth.toLowerCase().startsWith('bearer ')) {
		request.token = auth.substring(7)
	}
	next()
}

/**
 * Checks if a token can be found from request.token and if found, tries to verify that jsonwebtoken
 * @returns {response} 401 - if token not found or invalid
 * Sets the found and correct token info to request.decodedToken
 * The format of the returned request.decodedToken object is { id, username }
 */
const authenticator = (request, response, next) => {
	if (!request.token) {
		return response.status(401).json({ error: 'token missing' })
	}

	const decodedToken = jwt.verify(request.token, process.env.SECRET)

	if(!decodedToken.id) {
		return response.status(401).json({ error: 'token invalid' })
	}

	request.decodedToken = decodedToken
	next()
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	authenticator
}