const Customer_Authorize = require('./authorize');
const CreditCard_Capture = require('./capture');

module.exports = {
  authorize: new Customer_Authorize('CUSTOMER_AUTHORIZE'),
  capture: new CreditCard_Capture('CAPTURE_TRANSACTION'),
};
