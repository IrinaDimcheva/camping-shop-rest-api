const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: [4, 'Name should be at least 4 characters'],
		maxlength: [150, 'Name shouldn\'t exceed 150 characters']
	},
	imageUrl: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true,
		minlength: [10, 'Description should be at least 10 characters'],
		maxlength: [2000, 'Description shouldn\'t exceed 2000 characters']
	},
	info: [{
		type: String,
		required: true
	}],
	price: {
		type: Number,
		required: true,
		min: 0.01
	},
	quantity: {
		type: Number,
		required: true,
		min: 0
	},
	category: {
		type: String,
		required: true
	},
	rating: [{
		type: ObjectId,
		ref: "User"
	}],
	userId: {
		type: ObjectId,
		ref: "User"
	},
	comments: [{
		type: ObjectId,
		ref: "Comment"
	}]
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Product', productSchema);
