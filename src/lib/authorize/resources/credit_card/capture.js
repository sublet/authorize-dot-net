const Authorize = require('../../../base/authorize');

/**
 * Capture a previously Authorize Credit Card.
 *
 * @class CreditCard_Authorize
 * @extends Base
 *
 * https://developer.authorize.net/api/reference/index.html#payment-transactions-authorize-a-credit-card
 *
 */

class CreditCard_Capture extends Authorize {
  default() {
    return {
      reference_id: null,
      amount: null,
      transaction_id: null,
      invoice_number: null,
      description: '',
    };
  }

  toJsonPayload() {
    const json = this._convertPayloadToJson();
    return json;
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
          transactionId: data.transId._text,
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

  testResponse() {
    return `
      <?xml version="1.0" encoding="utf-8"?>
      <createTransactionResponse xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
        <refId>${this._referenceId}</refId>
        <messages>
          <resultCode>Ok</resultCode>
          <message>
            <code>I00001</code>
            <text>Successful.</text>
          </message>
        </messages>
        <transactionResponse>
          <responseCode>1</responseCode>
          <authCode>KMBE52</authCode>
          <avsResultCode>P</avsResultCode>
          <cvvResultCode />
          <cavvResultCode />
          <transId>60148747702</transId>
          <refTransID>60148747702</refTransID>
          <transHash />
          <testRequest>0</testRequest>
          <accountNumber>XXXX0015</accountNumber>
          <accountType>MasterCard</accountType>
          <messages>
            <message>
              <code>1</code>
              <description>This transaction has been approved.</description>
            </message>
          </messages>
          <transHashSha2 />
        </transactionResponse>
      </createTransactionResponse>
    `;
  }
}

module.exports = CreditCard_Capture;
