const CreditCard_Charge = require('./charge');
const CreditCard_Authorize = require('./authorize');
const CreditCard_Capture = require('./capture');

module.exports = {
  charge: new CreditCard_Charge('CREATE_TRANSACTION'),
  authorize: new CreditCard_Authorize('AUTHORIZE_TRANSACTION'),
  capture: new CreditCard_Capture('CAPTURE_TRANSACTION'),
};
