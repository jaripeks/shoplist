const listsRouter = require('express').Router()
const List = require('../models/list')
const User = require('../models/user')
const itemsHelper = require('../utils/items_helper')

listsRouter.get('/', async (req, res) => {
	const lists = await List
		.find({ user: req.decodedToken.id })
		.populate('items', { date: 0, list: 0 })
	res.json(lists.map(list => list.toJSON()))
})

listsRouter.get('/:id', async (req, res) => {
	const list = await List.findById(req.params.id)
	if (list) {
		return list.user.toString() === req.decodedToken.id.toString()
			? res.status(200).json(list.toJSON())
			: res.status(401).json({ error: 'cannot display lists created by other users' })
	}
	return res.status(404).json({ error: 'ID not found' })
})

listsRouter.post('/', async (req, res) => {
	const user = await User.findById(req.decodedToken.id)

	const list = new List({
		name: req.body.name,
		created: req.body.created ? req.body.created : new Date(),
		default: req.body.default !== undefined ? req.body.default : false,
		active: req.body.active !== undefined ? req.body.active : true,
		user: user._id
	})
	//save list to create an id
	let result = await list.save()
	//create items if available
	const items = req.body.items
		? await itemsHelper.convertToEvent(req.body.items.map(item => {
			return ({
				...item,
				list: result._id
			})
		}))
		: null

	const updatedList = list.toJSON()

	//if available insert items to list and save again
	if (items !== null) {
		result = await List
			.findByIdAndUpdate(result._id, { ...updatedList, items }, { new: true })
			.populate('items')
	}
	user.lists = user.lists.concat(result._id)
	await user.save()

	res.status(201).json(result.toJSON())
})

listsRouter.put('/:id', async (req, res) => {
	const listToUpdate = await List.findById(req.params.id)

	if (listToUpdate.user.toString() === req.decodedToken.id.toString()) {
		const list = {
			name: req.body.name,
			created: req.body.created ? req.body.created : new Date(),
			completed: req.body.completed ? req.body.completed : new Date(),
			default: req.body.default !== undefined ? req.body.default : false,
			active: req.body.active !== undefined ? req.body.active : true,
			items: req.body.items ? req.body.items : [],
			user: req.decodedToken.id
		}

		const updated = await List.findByIdAndUpdate(req.params.id, list, { new: true })
		return res.status(200).json(updated.toJSON())
	}

	return res.status(401).json({ error: 'cannot update list created by a different user' })
})

listsRouter.delete('/:id', async (req, res) => {
	const listToDelete = await List.findById(req.params.id)

	if (listToDelete.user.toString() === req.decodedToken.id.toString()) {
		await List.findByIdAndDelete(req.params.id)
		return res.status(204).end()
	}

	return res.status(401).json({ error: 'cannot delete list created by a different user' })
})

module.exports = listsRouter