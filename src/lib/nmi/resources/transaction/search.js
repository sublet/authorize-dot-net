const NMI = require('../../../base/nmi');
const convert = require('xml-js');

/**
 * Transaction Search
 *
 * @class Transaction_Search
 * @extends NMI
 *
 * https://secure.networkmerchants.com/gw/merchants/resources/integration/integration_portal.php#query_variables
 *
 */

class Transaction_Search extends NMI {
  build(data, key) {
    const payload = this.default();

    payload.security_key = data.access_key ? data.access_key : key;

    return payload;
  }

  // Set Defaults
  default() {
    return {
      security_key: null,
    };
  }

  toJson() {
    const jsonString = convert.xml2json(this._response, {
      compact: true,
      spaces: 4,
    });
    const json = JSON.parse(jsonString);

    if (json && json.nm_response) {
      let response = {
        isSuccess: false,
        referenceId: this._payload.merchant_defined_field_1,
        messages: null,
        errors: null,
      };
      if (json.nm_response.transaction) {
        response.isSuccess = true;
        response['response'] = json.nm_response.transaction.map(itm => {
          let reference_id = null;
          let i = 1;
          let custom_fields = [];

          if (Array.isArray(itm.merchant_defined_field)) {
            const referenceIdIsFound = itm.merchant_defined_field.find(
              field => field._attributes.id === 1,
            );
            if (referenceIdIsFound) {
              reference_id = referenceIdIsFound._text;
            }
            Array.from(Array(10)).forEach(() => {
              const doesExist = itm.merchant_defined_field.find(
                field => field._attributes.id === i + 1,
              );
              if (doesExist) {
                if (doesExist._text) {
                  const json = JSON.parse(doesExist._text);
                  if (json) {
                    custom_fields.push({ [json.key]: json.value });
                  }
                }
              }
              i++;
            });
          } else {
            reference_id = itm.merchant_defined_field._text;
          }

          if (!Array.isArray(itm.action)) itm.action = [itm.action];

          return {
            reference_id,
            transaction_id: itm.transaction_id._text,
            transaction_type: itm.transaction_type._text,
            condition: itm.condition._text,
            authorization_code: itm.authorization_code._text,
            account: {
              id: itm.customerid._text,
              first_name: itm.first_name._text,
              last_name: itm.last_name._text,
              email: itm.email._text,
            },
            custom_fields,
            actions: itm.action.map(action => {
              console.log(action);
              return {
                batch_id: action.batch_id._text,
                amount: action.amount._text,
                type: action.action_type._text,
                date: action.date._text,
                success: action.success._text === '1',
                ip_address: action.ip_address._text === '1',
                response: {
                  code: +action.response_code._text,
                  text: action.response_text._text,
                },
              };
            }),
          };
        });
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
    return null;
    // return 'response=1&responsetext=Customer Added&authcode=&transactionid=&avsresponse=&cvvresponse=&orderid=&type=&response_code=100&cc_number=5xxxxxxxxxxx0015&customer_vault_id=1077659627';
  }
}

module.exports = Transaction_Search;
