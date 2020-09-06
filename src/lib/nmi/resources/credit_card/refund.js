const NMI = require('../../../base/nmi');

/**
 * Refunds a Charge
 *
 * @class CreditCard_Refund
 * @extends NMI
 *
 * https://secure.networkmerchants.com/gw/merchants/resources/integration/integration_portal.php#transaction_variables
 *
 */

class CreditCard_Refund extends NMI {
  build(data, key) {
    const payload = this.default();

    if (!data.transaction_id) throw new Error('Transaction ID is invalid.');

    payload.security_key = data.access_key ? data.access_key : key;
    payload.transactionid = data.transaction_id;
    payload.void_reason = data.void_reason || 'user_cancel';

    return payload;
  }

  default() {
    return {
      security_key: null,
      type: 'refund',
      transactionid: null,
      void_reason: null,
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
      if (json.transactionid) {
        response.isSuccess = true;
        response['response'] = {
          transactionId: json.transactionid,
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
    authcode=&
    transactionid=5625138042&
    avsresponse=&
    cvvresponse=&
    orderid=&
    type=refund&
    response_code=100&
    cc_number=5xxxxxxxxxxx0015&
    customer_vault_id=
    `;
    return str.replace(/  |\r\n|\n|\r/gm, ''); // eslint-disable-line
  }
}

module.exports = CreditCard_Refund;
