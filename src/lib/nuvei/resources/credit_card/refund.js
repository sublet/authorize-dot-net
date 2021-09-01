const Base = require('../../../base/nuvei');

const path = require('path');
const moment = require('moment');

/**
 * Refunds a Charge
 *
 * @class CreditCard_Refund
 * @extends NMI
 *
 * https://secure.networkmerchants.com/gw/merchants/resources/integration/integration_portal.php#transaction_variables
 *
 */

class CreditCard_Refund extends Base {
  // Exposed Methods

  async build(params, config) {
    this._params = params;
    const data = this._buildData(params, config);
    data.terminalId = config.terminal_id;
    const filename = path.resolve(__dirname, '../../ejs/refund.ejs');
    return this._getFile(filename, { data });
  }

  /**
   *
   * @method buildHash
   *
   * @param {String} uniqueRef
   * @param {String} amount
   * @param {DateTime} dateTime
   * 
   * TERMINALID:UNIQUEREF:AMOUNT:DATETIME:SECRET
   */
  buildHash(
    { uniqueRef, amount, dateTime },
    config,
  ) {
    return this._generateHash(
      `${uniqueRef}:${amount}:${dateTime}`,
      config,
    );
  }

  // Auth Specific

  _buildData(data, config) {
    const dateTime = moment().format('DD-MM-YYYY:HH:mm:ss:sss')
    const hashParams = {
      uniqueRef: data.transaction_id,
      amount: data.amount,
      dateTime
    }
    return {
      ref: data.transaction_id,
      terminalId: null,
      amount: data.amount,
      dateTime: dateTime,
      hash: this.buildHash(hashParams, config)
    }
  }

  toJson() {
    let json = null;
    if (this._response['ERROR']) {
      json = this._map(this._response['ERROR'], this._params);
    } else {
      json = this._map(
        this._response['REFUNDRESPONSE'],
        this._params,
      );
    }

    if (json) {
      let response = {
        isSuccess: false,
        referenceId: null,
        messages: {},
        errors: {},
      };
      if (json.errorResponse) {
        response.errors = {
          code: 'ERROR',
          message: json.errorResponse,
        };
      } else {
        response.isSuccess = true;
        response.messages = {
          response: '1',
          responseCode: 'SUCCESS',
          code: '100',
          message: 'SUCCESS'
        };
        response['response'] = {
          transactionId: json.ref,
          hash: json.hash
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
   */
  _map(response) {
    const errorResponse = response['ERRORSTRING']
      ? response['ERRORSTRING']
      : null;
    return {
      ref: response['UNIQUEREF'],
      responseCode: response['RESPONSECODE'],
      responseText: response['RESPONSETEXT'],
      hash: response['HASH'],
      errorResponse,
    };
  }
}

module.exports = CreditCard_Refund;
