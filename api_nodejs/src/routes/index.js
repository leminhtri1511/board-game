const { checkAdmin, jwtAuth } = require('../middlewares/authorization');
const errorHandling = require('../utils/errorHandling');
const AuthRoute = require('./auth.route');
const UserRoute = require('./user.route');
const VoucherRoute = require('./voucher.route');
const ProductRoute = require('./product.route');
const CartRoute = require('./cart.route');
const FeedbackRoute = require('./feedback.route');
const OrderRoute = require('./order.route');
const CategoryRouter = require('./category.route');
function route(app) {
  app.get('/health', (req, res) => {
    res.send('OK');
  });
  app.use('/api/v1/auth', AuthRoute);
  app.use('/api/v1/products', ProductRoute);
  app.use('/api/v1/categories', CategoryRouter);
  app.post('/api/test', (req, res) => {
    const data = req.body;
    const result = JSON.parse(data);
    res.send(result);
  });
  app.use(jwtAuth);
  app.use('/api/v1/vouchers', VoucherRoute);
  app.use('/api/v1/users', UserRoute);
  app.use('/api/v1/cart', CartRoute);
  app.use('/api/v1/feedback', FeedbackRoute);
  app.use('/api/v1/orders', OrderRoute);
  app.use((err, req, res, next) => {
    errorHandling(err, res);
  });
}
module.exports = route;
