const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new Schema({
  creator: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    postal: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{4}$/.test(v);
        },
        message: props => `${props.value} should contains only digits, 4 symbols long.`
      }
    },
    city: {
      type: String,
      required: true
    }
  },
  products: [{
    type: Map,
    of: new Schema({
      productId: {
        type: ObjectId,
        ref: 'Product'
      },
      amount: {
        type: Number,
        default: 1
      }
    })
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "PENDING"
  },
  // userId: {
  //   type: ObjectId,
  //   ref: "User"
  // }
}, { timestamps: { createdAt: 'created_at' } });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
