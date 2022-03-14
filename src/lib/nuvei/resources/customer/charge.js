const Base = require('../../../base/nuvei');

const path = require('path');
const moment = require('moment');

/**
 * Authorize a charge on a customers card stored in the vault.
 *
 * @class Customer_Authorize
 * @extends Nuvei
 *
 */

class Customer_Charge extends Base {
  // Exposed Methods

  async build(params, config) {
    this._params = params;
    const data = this._buildData(params, config);
    data.terminalId = config.terminal_id;
    const filename = path.resolve(__dirname, '../../ejs/customer_charge.ejs');
    return this._getFile(filename, { data });
  }

  /**
   *
   * Build Hash with Proper Params
   *
   * @method buildHash
   *
   * @param {String} orderId
   * @param {String} amount
   * @param {DateTime} dateTime
   */
  buildHash({ orderId, amount, dateTime }, config) {
    return this._generateHash(`${orderId}:${amount}:${dateTime}`, config);
  }

  // Auth Specific

  _getMetaValue(arr, key) {
    if (arr && arr.length) {
      const foundPlanId = arr.find(itm => itm.key === key);
      if (foundPlanId) {
        return foundPlanId.value;
      }
    }
    return null;
  }

  _buildData(data, config) {
    const orderId = this.generateToken(24);
    const dateTime = moment().format('DD-MM-YYYY:HH:mm:ss:sss');
    const hashParams = {
      orderId: orderId,
      amount: data.amount,
      dateTime,
    };

    let planId = this._getMetaValue(data.custom_fields, 'plan_id');
    let tyoe = this._getMetaValue(data.custom_fields, 'type');

    return {
      orderId,
      terminalId: null,
      amount: data.amount,
      zip: data.zip,
      dateTime,
      cardType: 'SECURECARD',
      cardNumber: data.customer_vault_id,
      hash: this.buildHash(hashParams, config),
      currency: 'USD',
      cvv: data.cvv,
      victimId: planId,
      tyoe,
    };
  }

  toJson() {
    let json = null;
    if (this._response['ERROR']) {
      json = this._map(this._response['ERROR'], this._params);
    } else {
      json = this._map(this._response['PAYMENTRESPONSE'], this._params);
    }
    if (json) {
      let response = {
        isSuccess: false,
        referenceId: this._params.reference_id,
        messages: this._jsonMessages(json),
        errors: this._jsonErrors(null),
      };
      if (json.responseCode === 'A') {
        response.isSuccess = true;
        response['response'] = {
          authorizationCode: json.approvalCode,
          transactionId: json.ref,
          transactionHash: json.hash,
          customerId: this._params.customer_vault_id,
        };
      } else {
        response.errors = {
          code: 'ERROR',
          message: json.errorResponse,
        };
      }
      return response;
    }
    return {
      isSuccess: false,
      referenceId: null,
      messages: this._jsonMessages({
        response: 'ERROR',
        responseCode: null,
        code: null,
        message: ['JSON is invalid'],
      }),
      errors: {},
    };
  }

  /**
   *
   * Map Data properly.
   *
   * @method _map
   *
   * @param {Object} response
   * @param {Object} requestData
   */
  _map(response, requestData) {
    const errorResponse = response['ERRORSTRING']
      ? response['ERRORSTRING']
      : null;
    return {
      orderId: requestData.invoice_number,
      amount: requestData.amount,
      code: null,
      ref: response['UNIQUEREF'],
      status: response['RESPONSETEXT'],
      responseCode: response['RESPONSECODE'],
      approvalCode: response['APPROVALCODE'],
      avsResponse: response['AVSRESPONSE'],
      cvvResponse: response['CVVRESPONSE'],
      cardReference: response['CARDREFERENCE'],
      hash: response['HASH'],
      errorResponse,
    };
  }
}

module.exports = Customer_Charge;
