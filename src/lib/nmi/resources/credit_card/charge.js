const NMI = require('../../../base/nmi');

/**
 * Charges a Credit Card straight up.
 *
 * @class CreditCard_Charge
 * @extends NMI
 *
 * https://secure.networkmerchants.com/gw/merchants/resources/integration/integration_portal.php#transaction_variables
 *
 */

class CreditCard_Charge extends NMI {
  build(data, key) {
    const payload = this.default();

    payload.security_key = (data.access_key) ? data.access_key : key;
    (payload.amount = data.amount), (payload.ccnumber = data.card.number);
    payload.ccexp = `${
      data.card.expiration.month
    }${data.card.expiration.year.substr(2, 4)}`;
    payload.cvv = data.card.code;
    payload.merchant_defined_field_1 = data.reference_id;

    if (data.email) payload.email = data.email;
    if (data.phone) payload.phone = data.phone;
    if (data.billing.firstName) payload.first_name = data.billing.firstName;

    if (data.billing) {
      if (data.billing.firstName) payload.first_name = data.billing.firstName;
      if (data.billing.firstName) payload.last_name = data.billing.lastName;
      if (data.billing.address) payload.address1 = data.billing.address;
      if (data.billing.address2) payload.address2 = data.billing.address2;
      if (data.billing.city) payload.city = data.billing.city;
      if (data.billing.state) payload.state = data.billing.state;
      if (data.billing.zip) payload.zip = data.billing.zip;
      if (data.billing.country) payload.country = data.billing.country;
    }

    return payload;
  }

  default() {
    return {
      security_key: null,
      type: 'sale',
      amount: null,
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
      customer_receipt: false,
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
      if (json.transactionid) {
        response.isSuccess = true;
        response['response'] = {
          authorizationCode: json.authcode,
          transactionId: json.transactionid,
          transactionHash: null,
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
    const str = `
      response=1&
      responsetext=SUCCESS&
      authcode=123456&
      transactionid=5575816597&
      avsresponse=N&
      cvvresponse=M&
      orderid=&
      type=sale&
      response_code=100&
      cc_number=5xxxxxxxxxxx0015&
      customer_vault_id=
    `;
    return str.replace(/  |\r\n|\n|\r/gm, ''); // eslint-disable-line
  }
}

module.exports = CreditCard_Charge;
