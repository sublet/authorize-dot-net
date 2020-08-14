const CreditCard_Charge = require('./charge')
const CreditCard_Authorize = require('./authorize')

module.exports = {
  charge: new CreditCard_Charge('CREATE_TRANSACTION'),
  authorize: new CreditCard_Authorize('AUTHORIZE_TRANSACTION')
}