const NMI = require('../../../base/nmi');

/**
 * Validate a customers card in the vault.
 *
 * @class Customer_CardValidate
 * @extends NMI
 *
 * https://secure.networkmerchants.com/gw/merchants/resources/integration/integration_portal.php#cv_variables
 *
 */

class Customer_CardValidate extends NMI {
  build(data, key) {
    const payload = this.default();

    this.customerVaultId = data.customer_vault_id;

    payload.security_key = data.access_key ? data.access_key : key;
    payload.amount = data.amount;
    payload.customer_vault_id = data.customer_vault_id;
    payload.merchant_defined_field_1 = data.reference_id;

    let i = 1;
    data.custom_fields.forEach(field => {
      if (field.key && field.value && i <= 10) {
        payload[`merchant_defined_field_${i + 1}`] = JSON.stringify(field);
        i++;
      }
    });

    if (data.initiated_by) payload.initiated_by = data.initiated_by;
    if (data.stored_credential_indicator)
      payload.stored_credential_indicator = data.stored_credential_indicator;

    return payload;
  }

  default() {
    return {
      security_key: null,
      type: 'validate',
      amount: null,
      customer_vault_id: null,
      merchant_defined_field_1: null,
      initiated_by: 'customer',
      stored_credential_indicator: 'stored',
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
      if (json.response === '1') {
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
    // return null
    return `response=1&responsetext=SUCCESS&authcode=123456&transactionid=5614722100&avsresponse=N&cvvresponse=&orderid=&type=auth&response_code=100&cc_number=5xxxxxxxxxxx0015&customer_vault_id=${this.customerVaultId}`;
  }
}

module.exports = Customer_CardValidate;
