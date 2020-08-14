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

class CreditCard_Authorize extends Base {
  default() {
    return {
      reference_id: null,
      amount: null,
      customer_id: null,
      invoice_number: null,
      description: "",
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
          amount: "",
          name: "",
          description: "",
        },
        duty: {
          amount: "",
          name: "",
          description: "",
        },
        shipping: {
          amount: "",
          name: "",
          description: "",
        },
      },
      billing: {
        firstName: "",
        lastName: "",
        company: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "USA",
      },
      shipping: {
        firstName: "",
        lastName: "",
        company: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      meta_data: null,
    };
  }

  toJson() {
    const json = this._convertResponseToJson();
    return json;
  }
}

module.exports = CreditCard_Authorize;
