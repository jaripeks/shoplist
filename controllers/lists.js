const listsRouter = require('express').Router()
const List = require('../models/list')

listsRouter.get('/', async (req, res) => {
	const lists = await List.find({})
	res.json(lists.map(list => list.toJSON()))
})

listsRouter.get('/:id', async (req, res) => {
	const list = await List.findById(req.params.id)
	list ? res.status(200).json(list.toJSON()) : res.status(404).json({ error: 'ID not found' })
})

listsRouter.post('/', async (req, res) => {
	const list = new List({
		name: req.body.name,
		created: req.body.created ? req.body.created : new Date(),
		default: req.body.default !== undefined ? req.body.default : false,
		active: req.body.active !== undefined ? req.body.active : true,
		items: req.body.items ? req.body.items : []
	})

	const result = await list.save()
	res.status(201).json(result.toJSON())
})

listsRouter.put('/:id', async (req, res) => {
	const list = {
		name: req.body.name,
		created: req.body.created ? req.body.created : new Date(),
		completed: req.body.completed ? req.body.completed : new Date(),
		default: req.body.default !== undefined ? req.body.default : false,
		active: req.body.active !== undefined ? req.body.active : true,
		items: req.body.items ? req.body.items : []
	}

	const updated = await List.findByIdAndUpdate(req.params.id, list, { new: true })
	res.status(200).json(updated.toJSON())
})

listsRouter.delete('/:id', async (req, res) => {
	await List.findByIdAndDelete(req.params.id)
	res.status(204).end()
})

module.exports = listsRouter