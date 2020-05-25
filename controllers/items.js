const itemsRouter = require('express').Router()
const List = require('../models/list')
const helper = require('../utils/items_helper')

itemsRouter.get('/', async (req, res) => {
	const lists = await List.find({ user: req.decodedToken.id })
	//array containing arrays [[eventsFromList1],[eventsFromList2]...]
	const events = lists.map(list => list.items)

	const list = await helper.convertToItems(events)

	res.status(200).json(list)
})

module.exports = itemsRouter