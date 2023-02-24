const { userModel, tokenBlacklistModel } = require('../models');
const utils = require('../utils');
const { authCookieName } = require('../app-config');

const bsonToJson = (data) => { return JSON.parse(JSON.stringify(data)) };
const removePassword = (data) => {
	const { password, __v, ...userData } = data;
	return userData
}

function register(req, res, next) {
	const { username, email, password } = req.body;

	return userModel.create({ username, email, password })
		.then((createdUser) => {
			createdUser = bsonToJson(createdUser);
			createdUser = removePassword(createdUser);

			const token = utils.jwt.createToken({ id: createdUser._id });
			if (process.env.NODE_ENV === 'production') {
				res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
				// res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'strict', secure: true })
			} else {
				res.cookie(authCookieName, token, { httpOnly: true })
			}
			res.status(201)
				.send(createdUser);
		})
		.catch(err => {
			if (err.name === 'MongoError' && err.code === 11000) {
				let field = err.message.split("index: ")[1];
				field = field.split(" dup key")[0];
				field = field.substring(0, field.lastIndexOf("_"));

				res.status(409)
					.send({ message: `This ${field} is already registered!` });
				return;
			}
			next(err);
		});
}

function login(req, res, next) {
	const { email, password } = req.body;

	userModel.findOne({ email })
		.then(user => {
			return Promise.all([user, user ? user.matchPassword(password) : false]);
		})
		.then(([user, match]) => {
			if (!match) {
				res.status(401)
					.send({ message: 'Wrong email or password' });
				return;
			}
			user = bsonToJson(user);

			const token = utils.jwt.createToken({ id: user._id, isAdmin: user.admin });

			if (process.env.NODE_ENV === 'production') {
				res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
				// res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'strict', secure: true })
			} else {
				res.cookie(authCookieName, token, { httpOnly: true })
			}
			res.status(200)
				.send(user);
		})
		.catch(next);
}

function logout(req, res) {
	const token = req.cookies[authCookieName];

	tokenBlacklistModel.create({ token })
		.then(() => {
			res.clearCookie(authCookieName)
				.status(204)
				.send({ message: 'Logged out!' });
		})
		.catch(err => res.send(err));
}

function checkAuth(req, res, next) {
	const { userId } = req.user;
	if (!userId) {
		return res.status(202).send();
	}
	userModel.findById(userId).populate(['cart', 'favorites', 'orders']).then(user => {
		// return res.send({ username: user.username, _id: user._id, admin: user.isAdmin, cart: user.cart });
		return res.json(user);
	}).catch(error => {
		return res.status(204).send({ message: error });
	})
}

function getProfileInfo(req, res, next) {
	const { _id } = req.user;
	userModel.findOne({ _id }, { password: 0, __v: 0 })
		.populate('cart favorites orders')
		.then(user => {
			res.status(200).json({
				username: user.username,
				_id: user._id,
				isAdmin: user.isAdmin,
				email: user.email,
				cart: user.cart,
				favorites: user.favorites,
				orders: user.orders
			});
		})
		.catch(next);
}

function editProfileInfo(req, res, next) {
	const { _id: userId } = req.user;
	const { username, email } = req.body;

	userModel.findOneAndUpdate({ _id: userId }, { username, email }, { runValidators: true, new: true })
		.then(x => { res.status(200).json(x) })
		.catch(next);
}

module.exports = {
	login,
	register,
	logout,
	checkAuth,
	getProfileInfo,
	editProfileInfo,
}
