const itemsRouter = require('express').Router()
const List = require('../models/list')

itemsRouter.get('/', async (req, res) => {
	const lists = await List.find({ user: req.decodedToken.id })
	const events = lists.map(list => list.items)
	res.status(200).json(events)
})

module.exports = itemsRouter