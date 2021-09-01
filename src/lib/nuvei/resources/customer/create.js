const Base = require('../../../base/nuvei');

const path = require('path');
const moment = require('moment');

/**
 * Create a Customer.
 *
 * @class Customer_Create
 * @extends NUVEI
 *
 */

class Customer_Create extends Base {
  // Exposed Methods

  async build(params, config) {
    this._params = params;
    const data = this._buildData(params, config);
    data.terminalId = config.terminal_id;
    const filename = path.resolve(__dirname, '../../ejs/register_card.ejs');
    return this._getFile(filename, { data });
  }

  /**
   * 
   * MERCHANTREF:DATETIME:CARDNUMBER:CARDEXPIRY:CARDTYPE:CARDHOLDERNAME
   *
   * @method _generateCaptureHash
   * 
   * @param {String} merchantRef
   * @param {String} amount
   * @param {DateTime} dateTime
   */
   buildHash({ merchantRef, dateTime, cardNumber, cardExp, cardType, cardHolderName }, config) {
    return this._generateHash(`${merchantRef}:${dateTime}:${cardNumber}:${cardExp}:${cardType}:${cardHolderName}`, config);
  }

  // Auth Specific

  _buildData(data, config) {
    const dateTime = moment().format('DD-MM-YYYY:HH:mm:ss:sss')
    const cardYear =
      data.card.expiration.year.length === 4
        ? data.card.expiration.year.substr(2, 4)
        : data.card.expiration.year;
    const cardType = this.getCardType(data.card.number);
    const hashParams = {
      merchantRef: data.merchant_ref,
      cardNumber: data.card.number,
      cardExp: `${data.card.expiration.month}${cardYear}`,
      cardType,
      cardHolderName: `${data.customer.firstName} ${data.customer.lastName}`,
      dateTime
    }
    return {
      merchantRef: data.merchant_ref,
      terminalId: null,
      dateTime: dateTime,
      cardNumber: data.card.number,
      cardExp: `${data.card.expiration.month}${cardYear}`,
      cardType,
      cardHolderName: `${data.customer.firstName} ${data.customer.lastName}`,
      cvv: data.card.code,
      hash: this.buildHash(hashParams, config)
    }
  }

  toJson() {
    let json = null;
    if (this._response['ERROR']) {
      json = this._map(this._response['ERROR'], this._params);
    } else {
      json = this._map(this._response['SECURECARDREGISTRATIONRESPONSE'], this._params);
    }
    if (json) {
      let response = {
        isSuccess: false,
        referenceId: this._params.reference_id,
        messages: {},
        errors: this._jsonErrors(null),
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
          responseCode: 'Customer Added',
          code: '100',
          message: 'Customer Added'
        }
        response['response'] = {
          authorizationCode: '',
          transactionId: '',
          customerId: String(json.cardReference)
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
      merchantRef: response['MERCHANTREF'],
      cardReference: response['CARDREFERENCE'],
      hash: response['HASH'],
      errorResponse,
    };
  }
}

module.exports = Customer_Create;
