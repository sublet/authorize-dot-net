const Customer_Create = require('./create');
// const CreditCard_Authorize = require('./authorize');

module.exports = {
  create: new Customer_Create('CREATE_CUSTOMER'),
  // authorize: new CreditCard_Authorize('AUTHORIZE_TRANSACTION')
};
