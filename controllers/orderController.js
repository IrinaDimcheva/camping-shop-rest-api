const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');

function createOrder(req, res, next) {
  const { order: products, data: creator } = req.body;
  const { _id } = req.user;
  console.log('REQ.BODY-in-orders: ', req.body);
  console.log('ORDER: ', products);
  console.log('Creator: ', creator);
  console.log('REQ.USER-in-orders: ', req.user);
  const totalPrice = products.reduce((acc, curr) => {
    return acc += Number(curr.price) * Number(curr.amount);
  }, 0);

  orderModel.create({ creator, products, totalPrice })
    .then(order => {
      return userModel.updateOne({ _id },
        { $push: { orders: order._id } },
        { $set: { cart: [] } });
    }).then(order => {
      // console.log(order);
      res.status(200).json(order);
    })
    .catch(next);
}

function getOrders(req, res, next) {
  orderModel.find({}).populate('orders productId')
    .then(orders => {
      console.log('getOrders: ', orders);
      res.status(200).send(orders);
    }).catch(next);
}

module.exports = {
  createOrder,
  getOrders
};