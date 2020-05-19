const listsRouter = require('express').Router()
const List = require('../models/list')

listsRouter.get('/', async (req, res) => {
	const lists = await List.find({})
	res.json(lists.map(list => list.toJSON()))
})

listsRouter.get('/:id', async (req, res) => {
	const list = await List.findById(req.params.id)
	res.status(200).json(list.toJSON())
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