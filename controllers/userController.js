const userModel = require('../models/userModel');

function addToFavorites(req, res, next) {
  const { productId } = req.params;
  const { _id } = req.user;
  userModel.findByIdAndUpdate(_id, { $addToSet: { favorites: productId } }, { new: true })
    .then(updatedUser => {
      res.status(200).json(updatedUser)
    })
    .catch(next);
}

function removeFromFavorites(req, res, next) {
  const { productId } = req.params;
  console.log('req.params', req.params)
  const { _id } = req.user;
  console.log(productId, 'req.user ->', req.user);
  userModel.findByIdAndUpdate(_id, { $pull: { favorites: productId } })
    .then(() => {
      res.status(200).json({ message: 'Product successfully removed from favorites.' });
    })
    .catch(next);
}

function getFavorites(req, res, next) {
  const { _id } = req.user;
  userModel.findById({ _id }).populate('favorites').populate('userId')
    .then(user => {
      console.log(user)
      res.status(200).json(user.favorites);
    })
    .catch(next);
}

// function getCart(req, res, next) {
//   const { _id } = req.user;
//   userModel.findById(_id).populate('cart')
//     .then(user => {
//       // user.cart.reduce((acc, curr) => acc + +curr.price, 0);
//       res.status(200).json(user.cart);
//     })
//     .catch(next);
// }

function addToCart(req, res, next) {
  const { productId, amount } = req.body;
  const { _id } = req.user;
  let newAmount;
  userModel.findById(_id).then(user => {
    let existing = user.cart.find(i => i.productId?.toString() === productId);
    return existing;
    // res.status(200).json(product)
  }).then((existing) => {
    if (!existing) {
      userModel.findByIdAndUpdate(_id, { $push: { cart: { productId, amount } } })
        .then(() => {
          res.status(200).json({ message: 'Product successfully added to cart.' })
        })
        .catch(next);
    } else {
      newAmount = existing.amount + amount;
      userModel.findByIdAndUpdate(_id, { $set: { cart: { ...req.user.cart, productId, amount: newAmount } } })
        .then(() => {
          res.status(200).json({ message: 'Product successfully added to cart.' })
        })
        .catch(next);
    }
  }).catch(next);
  // if (existingProduct) {
  //   console.log(existingProduct)
  //   console.log('Amount: ', amount);
  //   newAmount = +existingProduct.amount + +amount;
  //   // userModel.findByIdAndUpdate(_id, { $set: { cart: { ...req.user.cart, productId, amount: newAmount } } })
  //   //   .then(() => {
  //   //     res.status(200).json({ message: 'Product successfully added to cart.' })
  //   //   })
  //   //   .catch(next);
  // } else {
  //   // userModel.findByIdAndUpdate(_id, { $push: { cart: { productId, amount } } })
  //   //   .then(() => {
  //   //     res.status(200).json({ message: 'Product successfully added to cart.' })
  //   //   })
  //   //   .catch(next);
  // }
}

// function removeFromCart(req, res, next) {
//   const { productId } = req.body;
//   const { _id } = req.user;
//   userModel.findOneAndUpdate(_id, { $pull: { cart: productId } })
//     .then(() => {
//       res.status(200).json({ message: 'Product successfully removed from cart.' })
//     })
//     .catch(next);
// }

function getCart(req, res, next) {
  const { _id } = req.user;
  userModel.findById(_id).populate('cart cart.productId')
    .then(user => {
      // console.log('GET_CART: ', user)
      // user.cart.reduce((acc, curr) => acc + +curr.price, 0);
      res.status(200).json(user.cart);
    })
    .catch(next);
}

// function addToCart(req, res, next) {
//   const { productId } = req.body;
//   const { _id } = req.user;
//   userModel.findByIdAndUpdate(_id, { $push: { cart: productId } })
//     .then(() => {
//       res.status(200).json({ message: 'Product successfully added to cart.' })
//     })
//     .catch(next);
// }

function removeFromCart(req, res, next) {
  const { productId } = req.body;
  const { _id } = req.user;
  // userModel.findByIdAndUpdate(_id, { $pull: { "cart.$.productId._id": productId } }, { new: true })
  userModel.findByIdAndUpdate(_id, { $pull: { cart: { _id: productId } } }, { new: true })
    .then(() => {
      res.status(200).json({ message: 'Product successfully removed from cart.' })
    })
    .catch(next);
}

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getCart,
  addToCart,
  removeFromCart
};