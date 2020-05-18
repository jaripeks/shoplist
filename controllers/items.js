const itemsRouter = require('express').Router()

itemsRouter.get('/', async (req, res) => {
	res.json({})
})

module.exports = itemsRouter