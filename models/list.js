const mongoose = require('mongoose')

const listSchema = mongoose.Schema({
	name: String,
	created: Date,
	completed: Date,
	default: Boolean,
	active: Boolean
})

listSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id,
		delete returnedObject._id
	}
})

module.exports = mongoose.model('List', listSchema)