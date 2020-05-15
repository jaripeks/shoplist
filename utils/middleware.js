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

module.exports = {
    requestLogger,
    unknownEndpoint
}