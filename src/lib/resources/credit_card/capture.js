const Base = require("../../base");

/**
 * Authorizes a Credit Card so it can be Charged at a later time.
 *
 * @class CreditCard_Authorize
 * @extends Base
 *
 * https://developer.authorize.net/api/reference/index.html#payment-transactions-authorize-a-credit-card
 *
 */

class CreditCard_Capture extends Base {
  default() {
    return {
      reference_id: null,
      amount: null,
      transaction_id: null,
      invoice_number: null,
      description: ""
    };
  }

  toJsonPayload() {
    const json = this._convertPayloadToJson();
    console.log(json)
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
        response["response"] = {
          transactionId: data.transId._text
        };
      }
      return response;
    } else if (json["ErrorResponse"]) {
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
    throw new Error("Problem parsing the XML to JSON");
  }
}

module.exports = CreditCard_Capture;
