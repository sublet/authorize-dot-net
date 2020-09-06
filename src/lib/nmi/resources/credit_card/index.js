const CreditCard_Charge = require('./charge');
const CreditCard_Authorize = require('./authorize');
const CreditCard_Capture = require('./capture');
const CreditCard_Refund = require('./refund');

module.exports = {
  charge: new CreditCard_Charge('CREATE_TRANSACTION'),
  authorize: new CreditCard_Authorize('AUTHORIZE_TRANSACTION'),
  capture: new CreditCard_Capture('CAPTURE_TRANSACTION'),
  refund: new CreditCard_Refund('REFUND_TRANSACTION'),
};
