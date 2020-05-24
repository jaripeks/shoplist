const mongoose = require('mongoose')
// this enables unique: true with the username
const validator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 3,
		unique: true
	},
	passwordHash: String,
	lists: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List'
	}]
})

userSchema.plugin(validator)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

module.exports = mongoose.model('User', userSchema)