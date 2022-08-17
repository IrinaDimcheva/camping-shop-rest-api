const jwt = require('./jwt');
const { authCookieName } = require('../app-config');
const { userModel, tokenBlacklistModel } = require('../models');

function auth(redirectUnauthenticated = true) {

	return function (req, res, next) {
		const token = req.cookies[authCookieName] || '';
		if (!token) { return next(); }
		Promise.all([
			jwt.verifyToken(token),
			tokenBlacklistModel.findOne({ token })
		])
			.then(([data, blacklistedToken]) => {
				if (blacklistedToken) {
					res.clearCookie(authCookieName);
					return Promise.reject(new Error('blacklisted token'));
				}
				userModel.findById(data.id)
					.then(user => {
						console.log('User DATA: ' + user);
						req.user = user;
						req.isLogged = true;
						req.isAdmin = user.isAdmin;
						console.log(req.isAdmin, req.user, req.isLogged)
						// res.locals.isLogged = true;
						next();
					})
			})
			.catch(err => {
				if (!redirectUnauthenticated) {
					next();
					return;
				}
				if (['token expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
					console.error(err);
					res
						.clearCookie(authCookieName)
						.status(401)
						.send({ message: "Invalid token!" });
					return;
				}
				next(err);
			});
	}
}

module.exports = auth;
