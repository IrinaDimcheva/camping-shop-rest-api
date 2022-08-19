const User = require('../models/userModel');

function admin() {
  return (req, res, next) => {
    const { _id } = req.user;
    // console.log('userId: ', _id)
    User.findOne(_id).then(user => {
      // console.log('admin middleware', user)
      if (user.isAdmin) {
        return next();
      }
      return next({ message: 'Not authorized for this operation.' });
    }).catch(err => {
      // console.log(err);
      res.status(401).send({ message: 'Not authorized for this operation.' });
      next(err);
    });
  };
}

module.exports = admin;