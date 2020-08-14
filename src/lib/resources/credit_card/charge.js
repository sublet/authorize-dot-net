const Base = require('../../base');

/**
 * Charges a Credit Card straight up.
 *
 * @class CreditCard_Charge
 * @extends Base
 *
 * https://developer.authorize.net/api/reference/index.html#payment-transactions-charge-a-credit-card
 *
 */

class CreditCard_Charge extends Base {
  default() {
    return {
      reference_id: null,
      amount: null,
      customer_id: null,
      invoice_number: null,
      description: '',
      ip_address: null,
      card: {
        number: null,
        code: null,
        expiration: {
          month: null,
          year: null,
        },
      },
      line_items: [],
      transaction: {
        tax: {
          amount: '',
          name: '',
          description: '',
        },
        duty: {
          amount: '',
          name: '',
          description: '',
        },
        shipping: {
          amount: '',
          name: '',
          description: '',
        },
      },
      billing: {
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'USA',
      },
      shipping: {
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
      meta_data: null,
    };
  }

  toJson() {
    const json = this._convertResponseToJson();
    if (json.createTransactionResponse) {
      const {
        createTransactionResponse: {
          refId,
          messages,
          transactionResponse: data,
        },
      } = json;
      let response = {
        isSuccess: false,
        referenceId: refId._text,
        messages: this._jsonMessages(messages),
        errors: this._jsonErrors(data.errors),
      };
      if (data.transId._text) {
        response.isSuccess = true;
        response['response'] = {
          authorizationCode: data.authCode._text,
          transactionId: data.transId._text,
          transactionHash: data.transHash._text,
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
    throw new Error('Problem parsing the XML to JSON');
  }
}

module.exports = CreditCard_Charge;
