// const _ = require('lodash');
const ejs = require('ejs');
const crypto = require('crypto');
const Fetch = require('./fetch');
const sha512 = require('js-sha512').sha512;
const parser = require('fast-xml-parser');
const creditCardType = require('credit-card-type');

/**
 * NMI Integration:
 * https://secure.networkmerchants.com/gw/merchants/resources/integration/integration_portal.php
 */

class Nuvei extends Fetch {
  constructor(type) {
    super();

    this._type = type;
    this._response = null;
    this._payload = null;
    this._uri = null;

    this._debug = process.env.DEBUG === 'true';
  }

  // Overwrites

  host() {
    return this._uri;
  }

  getHeaders() {
    return { Accept: 'text/xml', 'Content-Type': 'text/xml' };
  }

  default() {
    throw new Error('Must inherit this.');
  }

  build() {
    throw new Error('Must inherit this.');
  }

  toJson() {
    throw new Error('Must inherit this.');
  }

  testResponse() {
    throw new Error('Must inherit this.');
  }

  // Methods

  async process(data, config) {
    this._uri = config.uri;
    this._payload = await this.build(data, config);
    if (this._payload) {
      const results = await this.post('', this._payload);
      if (results && this._isValidXml(results)) {
        this._response = this._parseData(results);
        return this;
      }
      throw new Error('Problem with the XML Response.');
    }
    throw new Error('Payload could not be generated.');
  }

  async search(data, config) {
    this._uri = config.uri;
    this._payload = this.build(data, config.key);
    if (this._payload) {
      this._response = await this._query();
      return this;
    }
    throw new Error('Payload could not be generated.');
  }

  get payload() {
    return this._payload;
  }

  get response() {
    return this._response;
  }

  generateToken(length) {
    return crypto.randomBytes(Math.ceil(length / 2.0)).toString('hex');
  }

  getCardType(cardNumber) {
    const cardTypes = creditCardType(cardNumber);
    if (cardTypes.length) {
      const type = cardTypes[0].type.toUpperCase();
      return type;
    }
    throw new Error('Card type could not be determined.');
  }

  // private

  _isValidXml(data) {
    return parser.validate(data);
  }

  _parseData(data) {
    return parser.parse(data);
  }

  _getFile(filename, data) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(filename, data, (err, str) => {
        if (err) reject(err);
        resolve(str);
      });
    });
  }

  _generateHash(str, config) {
    return sha512(`${config.terminal_id}:${str}:${config.secret}`);
  }

  _getResponseCode(code) {
    switch (code) {
      case 'A':
        return 'APPROVED';
      case 'D':
        return 'DECLINED';
      default:
        return null;
    }
  }

  _jsonMessages(json) {
    return {
      response: json.status,
      responseCode: json.responseCode,
      responseText: json.responseText || json.status || null,
      code: json.responseCode,
      message: null,
    };
  }

  _jsonErrors(json) {
    // console.log('Errors: ', json)
    if (json && json.error && json.error.errorCode) {
      return {
        code: json.error.errorCode._text,
        message: json.error.errorText._text,
      };
    } else if (json && json.responseCode === 'D') {
      return {
        code: json.status,
        message: json.status,
      };
    }
    return {};
  }

  // async _send() {
  //   if (process.env.NODE_ENV === 'test') {
  //     const testResponse = this.testResponse();
  //     if (testResponse) return testResponse;
  //   }

  //   const data = querystring.stringify(this._payload);
  //   const response = await this.post(`/api/transact.php`, data);
  //   if (response) {
  //     return response;
  //   }
  //   throw new Error('Response is invalid');
  // }

  _queryStringToJSON(queryString) {
    const pairs = queryString.split('&');
    const result = {};
    pairs.forEach(function (pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
  }
}

module.exports = Nuvei;
