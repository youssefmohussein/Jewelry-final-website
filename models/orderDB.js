 const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  product_ids: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required:true
}],
  orderDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  total_price : {
    type: Number,
    required: true
  },
  shippingAddress: {
      address: {
        type: String,
        required: true 
      },
        city: {
          type: String,
          required: true 
      },
        postalCode: {
          type: String, 
          required: true 
      },
        country: {
          type: String,
          required: true
      }
  },
  status :{
    type:String,
    enum:['pending','processing','shipped','delivered','cancelled'],
    default:'pending'
  },
  Payment_method:{
    type:String,
    enum:['credit_card'],
    required:false
  },
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;