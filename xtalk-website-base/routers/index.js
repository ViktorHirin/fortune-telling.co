/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var prefix = '/api/v1/';
var backendPrefix = '/api/backend/';
module.exports = function (app) {
  var auth = require('../api/auth.service');
  app.get('/', (req, res) => {
    res.sendFile('index.html');
  })
  app.use(prefix + 'user', require('../api/v1/user'));
  app.use(prefix + 'model', require('../api/v1/model'));
  app.use(prefix + 'auth', require('../api/v1/auth'));
  app.use(prefix + 'categories', require('../api/v1/category'));
  app.use(prefix + 'reviews', require('../api/v1/review'));
  app.use(prefix + 'payment-setting', require('../api/v1/paymentSetting'));
  app.use(prefix + 'call', require('../api/v1/call'));
  app.use(prefix + 'chat', require('../api/v1/chat'));
  app.use(prefix + 'commission', require('../api/v1/commission'));
  app.use(prefix + 'withdraws', require('../api/v1/withdraw'));
  app.use(prefix + 'page-config', require('../api/v1/page'));
  app.use(prefix + 'bank', require('../api/v1/bank'));
  app.use(prefix + 'gallery', require('../api/v1/gallery'));
  app.use(prefix + 'member', require('../api/v1/auth/index'));
  app.use(prefix + 'order', require('../api/v1/order/index'));
  app.use(prefix + 'ads', require('../api/v1/ads/index'));
  app.use(prefix + 'ticket', require('../api/v1/ticket/index'));
  app.use(prefix + 'static-page', require('../api/v1/static-page/index'));
  app.use(prefix + 'file', require('../api/v1/file/index'));
  app.use(prefix + 'option', require('../api/v1/option/index'));
  app.use(prefix + 'news-letters', require('../api/v1/newsletter/index'));
  app.use(backendPrefix + 'config', require('../api/backend/config/index'));
  app.use(backendPrefix + 'reports', require('../api/backend/reports/index'));
  app.use(backendPrefix + 'order', require('../api/backend/order/index'));
  app.use(backendPrefix + 'ads', require('../api/backend/ads/index'));
  app.use(backendPrefix + 'payout', require('../api/backend/payout/index'));
  app.use(backendPrefix + 'static-page', require('../api/backend/static-page/index'));
  app.use(backendPrefix + 'ads', require('../api/backend/ads/index'));
  app.use(backendPrefix + 'payouts', require('../api/backend/payout/index'));
  app.use(backendPrefix + 'pages', require('../api/backend/static-page/index'));
  app.use(backendPrefix + 'model', require('../api/backend/model/index'));
  app.use(backendPrefix + 'user', require('../api/backend/user/index'));
  app.use(backendPrefix + 'upload', require('../api/backend/file/index'));
  app.use(backendPrefix + 'option', require('../api/backend/option/index'));
}
