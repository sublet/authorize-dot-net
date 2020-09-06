const Authorize = require('../../../base/authorize');

/**
 * Charges a Credit Card straight up.
 *
 * @class CreditCard_Charge
 * @extends Base
 *
 * https://developer.authorize.net/api/reference/index.html#payment-transactions-charge-a-credit-card
 *
 */

class Customer_Create extends Authorize {
  default() {
    return {
      customer: {
        merchant_customer_id: null,
        description: '',
        email: null,
      },
      card: null,
      isTest: false,
    };
  }

  toJson() {
    const json = this._convertResponseToJson();
    if (json.createCustomerProfileResponse) {
      const {
        createCustomerProfileResponse: { messages, customerProfileId },
      } = json;
      let response = {
        isSuccess: false,
        messages: this._jsonMessages(messages),
        errors: this._jsonErrors(null),
      };
      if (customerProfileId._text) {
        response.isSuccess = true;
        response['response'] = {
          authorizationCode: null,
          transactionId: null,
          customerId: customerProfileId._text,
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
      <createCustomerProfileResponse xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
        <messages>
          <resultCode>Ok</resultCode>
          <message>
            <code>I00001</code>
            <text>Successful.</text>
          </message>
        </messages>
        <customerProfileId>1927573526</customerProfileId>
        <customerPaymentProfileIdList>
          <numericString>1839796353</numericString>
        </customerPaymentProfileIdList>
        <customerShippingAddressIdList />
        <validationDirectResponseList>
          <string>1,1,1,(TESTMODE) This transaction has been approved.,000000,P,0,none,Test transaction for ValidateCustomerPaymentProfile.,1.00,CC,auth_only,141c742de68c4ebaadaf,,,,,,,,,,,yoman@bob.com,,,,,,,,,0.00,0.00,0.00,FALSE,none,,,,,,,,,,,,,,XXXX0015,MasterCard,,,,,,,,,,,,,,,,,</string>
        </validationDirectResponseList>
      </createCustomerProfileResponse>
    `;
  }
}

module.exports = Customer_Create;
