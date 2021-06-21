const allowed = [
  {
    slug: 'plan_payments',
    type: 'INTEGER',
    description:
      'The number of payments before the recurring plan is complete.',
    notes: '0 for until canceled',
    isRequired: true,
  },
  {
    slug: 'plan_amount',
    type: 'FLOAT',
    description: 'The plan amount to be charged each billing cycle.',
    notes: 'Format: x.xx',
    isRequired: true,
  },
  {
    slug: 'plan_name',
    type: 'STRING',
    description: 'The display name of the plan.',
    notes: '',
    isRequired: true,
  },
  {
    slug: 'plan_id',
    type: 'STRING',
    description: 'The unique plan ID that references only this recurring plan.',
    notes: '',
    isRequired: true,
  },
  {
    slug: 'frequency_type',
    type: 'ENUM',
    values: ['DAYS', 'MONTHS', 'DAY_OF_MONTH'],
    description: 'How often, in days, to charge the customer.',
    notes: '',
    isRequired: true,
  },
  {
    slug: 'frequency_amount',
    type: 'INTEGER',
    description: 'The plan amount to be charged each billing cycle.',
    notes: 'For 7 days, enter 7 here and pass in DAYS for frequency_type.',
    isRequired: true,
  },
];

const NMI = require('../../../base/nmi');
const types = require('../../../types');

/**
 * Create a Recurring Plan
 *
 * @class Recurring_PlanCreate
 * @extends NMI
 *
 * https://secure.networkmerchants.com/gw/merchants/resources/integration/integration_portal.php#recurring_variables
 *
 */

class Recurring_PlanCreate extends NMI {
  build(params, key) {
    const payload = this.default();

    types.checkAllowed(params, allowed);
    allowed.forEach(itm => {
      if (['frequency_type', 'frequency_amount'].indexOf(itm.slug) < 0) {
        payload[itm.slug] = params[itm.slug];
      }
    });

    if (params.frequency_type === 'DAYS') {
      payload.day_frequency = params.frequency_amount;
    } else if (params.frequency_type === 'MONTHS') {
      payload.month_frequency = params.frequency_amount;
    } else if (params.frequency_type === 'DAY_OF_MONTH') {
      payload.day_of_month = params.frequency_amount;
    } else {
      throw new Error("You shouldn't be here.");
    }

    payload.security_key = params.access_key ? params.access_key : key;

    // cleanup
    Object.keys(payload).forEach(k => {
      if (!payload[k]) delete payload[k];
    });

    return payload;
  }

  default() {
    return {
      security_key: null,
      recurring: 'add_plan',
      plan_payments: null,
      plan_amount: null,
      plan_name: null,
      plan_id: null,
      day_frequency: null,
      month_frequency: null,
      day_of_month: null,
    };
  }

  toJson() {
    const json = this._queryStringToJSON(this._response);
    if (json) {
      let response = {
        isSuccess: false,
        messages: this._jsonMessages(json),
        errors: this._jsonErrors(null),
      };
      if (json.response_code === '100') {
        response.isSuccess = true;
        response['response'] = {
          message: json.responsetext,
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
    return 'response=1&responsetext=Plan Added&authcode=&transactionid=&avsresponse=&cvvresponse=&orderid=&type=&response_code=100&cc_number=&customer_vault_id=&checkaba=&checkaccount=';
    // return null
  }
}

module.exports = Recurring_PlanCreate;
