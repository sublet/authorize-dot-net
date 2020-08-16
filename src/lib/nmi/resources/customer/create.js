const NMI = require('../../../base/nmi');

/**
 * Create a Customer.
 *
 * @class Customer_Create
 * @extends NMI
 *
 * https://developer.authorize.net/api/reference/index.html#payment-transactions-charge-a-credit-card
 *
 */

class Customer_Create extends NMI {
  build(data, key) {
    const payload = this.default();

    payload.security_key = key;
    (payload.amount = data.amount), (payload.ccnumber = data.card.number);
    payload.ccexp = `${
      data.card.expiration.month
    }${data.card.expiration.year.substr(2, 4)}`;
    payload.cvv = data.card.code;
    payload.merchant_defined_field_1 = data.reference_id;

    if (data.customer.email) payload.email = data.customer.email;
    if (data.customer.phone) payload.phone = data.customer.phone;
    if (data.customer.firstName) payload.first_name = data.customer.firstName;

    if (data.customer) {
      if (data.customer.firstName) payload.first_name = data.customer.firstName;
      if (data.customer.firstName) payload.last_name = data.customer.lastName;
      if (data.customer.address) payload.address1 = data.customer.address;
      if (data.customer.address2) payload.address2 = data.customer.address2;
      if (data.customer.city) payload.city = data.customer.city;
      if (data.customer.state) payload.state = data.customer.state;
      if (data.customer.zip) payload.zip = data.customer.zip;
      if (data.customer.country) payload.country = data.customer.country;
    }

    return payload;
  }

  default() {
    return {
      security_key: null,
      customer_vault: 'add_customer',
      ccnumber: null,
      ccexp: null,
      cvv: null,
      first_name: null,
      last_name: null,
      company: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      zip: null,
      phone: null,
      email: null,
      merchant_defined_field_1: null,
    };
  }

  toJson() {
    const json = this._queryStringToJSON(this._response);
    if (json) {
      let response = {
        isSuccess: false,
        referenceId: this._payload.merchant_defined_field_1,
        messages: this._jsonMessages(json),
        errors: this._jsonErrors(null),
      };
      if (json.customer_vault_id) {
        response.isSuccess = true;
        response['response'] = {
          authorizationCode: json.authcode,
          transactionId: json.transactionid,
          customerId: json.customer_vault_id,
        };
      }
      return response;
    } else if (json['ErrorResponse']) {
      const {
        ErrorResponse: { messages },
      } = json;
      return {
        isSuccess: false,
        referenceId: null,
        messages: this._jsonMessages(messages),
        errors: {},
      };
    }
    throw new Error('Problem parsing the Form to JSON');
  }

  testResponse() {
    return 'response=1&responsetext=Customer Added&authcode=&transactionid=&avsresponse=&cvvresponse=&orderid=&type=&response_code=100&cc_number=5xxxxxxxxxxx0015&customer_vault_id=1077659627';
  }
}

module.exports = Customer_Create;
