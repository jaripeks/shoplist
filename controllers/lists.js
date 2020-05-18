const listsRouter = require('express').Router()
const List = require('../models/list')

listsRouter.get('/', async (req, res) => {
	const lists = await List.find({})
	res.json(lists.map(list => list.toJSON()))
})

listsRouter.post('/', async (req, res) => {
	const list = new List({
		name: req.body.name,
		created: new Date(),
		default: req.body.default ? req.body.default : false,
		active: req.body.active ? req.body.active : true
	})

	const result = await list.save()
	res.status(201).json(result.toJSON())
})

module.exports = listsRouter