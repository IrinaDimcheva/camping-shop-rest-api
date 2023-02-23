const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.SALTROUNDS) || 5;

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: [3, 'Username should be at least 3 characters'],
		maxlength: [25, 'Username shouldn\'t exceed 25 characters'],
	},
	password: {
		type: String,
		required: true,
		minlength: [6, 'Password should be at least 6 characters'],
		maxlength: [35, 'Password shouldn\'t exceed 35 characters'],
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	cart: [{
		productId: {
			type: ObjectId,
			ref: 'Product'
		},
		amount: {
			type: Number,
			default: 1
		}
	}],
	favorites: [{
		type: ObjectId,
		ref: 'Product'
	}],
	orders: [{
		type: ObjectId,
		ref: 'Order'
	}],
	productId: {
		type: ObjectId,
		ref: 'Product'
	},
}, { timestamps: { createdAt: 'created_at' } });

userSchema.methods = {
	matchPassword: function (password) {
		return bcrypt.compare(password, this.password);
	}
}

userSchema.pre('save', function (next) {
	if (this.isModified('password')) {
		bcrypt.genSalt(saltRounds, (err, salt) => {
			if (err) {
				next(err);
			}
			bcrypt.hash(this.password, salt, (err, hash) => {
				if (err) {
					next(err);
				}
				this.password = hash;
				next();
			})
		})
		return;
	}
	next();
});

module.exports = mongoose.model('User', userSchema);
