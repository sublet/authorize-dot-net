const Customer_Create = require('./create');
const Customer_Authorize = require('./authorize');

module.exports = {
  create: new Customer_Create('CREATE_CUSTOMER'),
  authorize: new Customer_Authorize('CUSTOMER_AUTHORIZE')
};
