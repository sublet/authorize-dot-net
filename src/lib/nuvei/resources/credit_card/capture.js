const Base = require('../../../base/nuvei');

const path = require('path');
const moment = require('moment');

/**
 * Captures a Credit Card that was previously Authorized.
 *
 * @class CreditCard_Capture
 * @extends Nuvei
 *
 */

class CreditCard_Capture extends Base {
  // Exposed Methods

  async build(params, config) {
    this._params = params;
    const data = this._buildData(params, config);
    data.terminalId = config.terminal_id;
    const filename = path.resolve(__dirname, '../../ejs/capture.ejs');
    return this._getFile(filename, { data });
  }

  /**
   * @method buildHash
   *
   * @param {String} uniqueRef
   * @param {String} amount
   * @param {DateTime} dateTime
   */
  buildHash({ uniqueRef, amount, dateTime }, config) {
    return this._generateHash(`${uniqueRef}:${amount}:${dateTime}`, config);
  }

  // Auth Specific

  _buildData(data, config) {
    const dateTime = moment().format('DD-MM-YYYY:HH:mm:ss:sss');
    const hashParams = {
      uniqueRef: data.transaction_id,
      amount: data.amount,
      dateTime,
    };
    return {
      ref: data.transaction_id,
      terminalId: null,
      amount: data.amount,
      dateTime: dateTime,
      cvv: data.card.code,
      hash: this.buildHash(hashParams, config),
      //   victimId: '123-123-123',
    };
  }

  toJson() {
    let json = null;
    if (this._response['ERROR']) {
      json = this._map(this._response['ERROR'], this._params);
    } else {
      json = this._map(
        this._response['PREAUTHCOMPLETIONRESPONSE'],
        this._params,
      );
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

module.exports = CreditCard_Capture;
