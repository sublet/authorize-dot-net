const Customer_Create = require('./create');
const Customer_Charge = require('./charge');
const Customer_Authorize = require('./authorize');
// const Customer_CardValidate = require('./validate');
const Customer_Update = require('./update');

module.exports = {
  create: new Customer_Create('CREATE_CUSTOMER'),
  charge: new Customer_Charge('CUSTOMER_SALE'),
  authorize: new Customer_Authorize('CUSTOMER_AUTHORIZE'),
  // validate: new Customer_CardValidate('CUSTOMER_VALIDATE'),
  update: new Customer_Update('CUSTOMER_UPDATE'),
};
