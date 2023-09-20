const joi = require('joi');

// Auth
const signUpSchema = joi.object({
  username: joi.string().min(4).max(50).required(),
  email: joi.string().email().required(),
  password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const signInSchema = joi.object({
  username: joi.string().min(4).max(50).required(),
  password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const changePassSchema = joi.object({
  pass: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  newPass: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  confirmNewPass: joi
    .string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
});

// User Address
const addressSchema = joi.object({
  userId: joi.number().required(),
  fullName: joi.string().max(250).required(),
  phone: joi.string().regex(/^\d+$/).min(8).max(11).required(),
  address: joi.string().min(5).max(500).required(),
  isDefault: joi.allow('0', '1').required(),
});
const addressUpdateSchema = joi.object({
  userId: joi.number(),
  fullName: joi.string().max(250),
  phone: joi.string().regex(/^\d+$/).min(8).max(11),
  address: joi.string().min(5).max(500),
  isDefault: joi.allow('0', '1'),
});
// Voucher
const voucherSchema = joi.object({
  code: joi.string().max(250).required(),
  expired: joi.string().required(),
  amount: joi.number().required(),
  value: joi.number().required(),
  status: joi.number().valid(9, 1),
  type: joi.number().valid(0, 1),
});
const voucherUpdateSchema = joi.object({
  code: joi.string().max(250),
  expired: joi.string(),
  amount: joi.number(),
  value: joi.number(),
  status: joi.number().valid(9, 1),
  type: joi.number().valid(0, 1),
});

// Feedback
const feedbackSchema = joi.object({
  orderId: joi.number(),
  productId: joi.number(),
  stars: joi.number().min(1).max(5),
  comment: joi.string(),
  listImage: joi.string(),
});

// Order
const newOrderSchema = joi.object({
  userId: joi.number().required(),
  userAddressId: joi.number().required(),
  voucherId: joi.number(),
  value: joi.number(),
  ship: joi.number(),
  listProduct: joi.string(),
});

module.exports = {
  signInSchema,
  signUpSchema,
  changePassSchema,
  voucherSchema,
  voucherUpdateSchema,
  feedbackSchema,
  newOrderSchema,
  addressSchema,
  addressUpdateSchema,
};
