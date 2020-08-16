const NMI = require('../../../base/nmi');

/**
 * Capture a previously Authorize Credit Card.
 *
 * @class CreditCard_Charge
 * @extends NMI
 *
 * https://developer.authorize.net/api/reference/index.html#payment-transactions-charge-a-credit-card
 *
 */

class CreditCard_Capture extends NMI {
  build(data, key) {
    const payload = this.default();

    payload.security_key = key;
    payload.transactionid = data.transaction_id;
    payload.amount = data.amount;
    payload.reference_id = data.reference_id;

    if (data.shipping_carrier) payload.shipping_carrier = data.shipping_carrier;
    if (data.order_id) payload.orderid = data.invoice_number;
    if (data.signature_image) payload.signature_image = data.signature_image;

    return payload;
  }

  default() {
    return {
      security_key: null,
      type: 'capture',
      transactionid: null,
      amount: null,
      shipping_carrier: null,
      orderid: null,
      signature_image: null,
    };
  }

  toJson() {
    const json = this._queryStringToJSON(this._response);
    if (json) {
      let response = {
        isSuccess: false,
        referenceId: this._payload.reference_id,
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
    var str = `
      response=1&
      responsetext=SUCCESS&
      authcode=123456&
      transactionid=5575836763&
      avsresponse=&
      cvvresponse=&
      orderid=&
      type=capture&
      response_code=100&
      cc_number=5xxxxxxxxxxx0015&
      customer_vault_id=
    `;
    return str.replace(/  |\r\n|\n|\r/gm, ''); // eslint-disable-line
  }
}

module.exports = CreditCard_Capture;
