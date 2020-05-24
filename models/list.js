const mongoose = require('mongoose')

const listSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	created: Date,
	completed: Date,
	default: Boolean,
	active: Boolean,
	items: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event'
		}
	],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
})

listSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		// mongo default field, no need to expose to the user
		delete returnedObject.__v
		// by default, documents in mongo have an _id field -> change to id-field for easier handling
		returnedObject.id = returnedObject._id,
		delete returnedObject._id
		// user can only monitor lists created by the user, so no need to expose the user id of the list
		delete returnedObject.user
	}
})

module.exports = mongoose.model('List', listSchema)