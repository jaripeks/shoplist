const bcrypt = require('bcrypt')
const usersController = require('express').Router()
const User = require('../models/user')

usersController.post('/', async (req, res) => {
	// pw checked here, because the string saved to mongo is a pw-hash
	if (!req.body.password || req.body.password.length < 3) {
		return res.status(400).json({ error: 'password must be atleast 3 characters' })
	}
	const saltRounds = 10
	const passwordHash = await bcrypt.hash(req.body.password, saltRounds)

	const user = new User({
		username: req.body.username,
		passwordHash
	})

	const savedUser = await user.save()
	res.status(201).json(savedUser)
})

module.exports = usersController