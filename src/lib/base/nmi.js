// const _ = require('lodash');
const querystring = require('querystring');
const Fetch = require('./fetch');

/**
 * NMI Integration:
 * https://secure.networkmerchants.com/gw/merchants/resources/integration/integration_portal.php
 */

class NMI extends Fetch {
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
    const data = querystring.stringify(this._payload);

    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data),
    };
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
    this._payload = this.build(data, config.key);
    //console.log(this._payload);
    if (this._payload) {
      this._response = await this._send();
      //console.log(this._response);
      return this;
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

  // private

  _jsonMessages(json) {
    return {
      response: json.response,
      responseCode: json.responsetext,
      code: json.response_code,
      message: json.responsetext,
    };
  }

  _jsonErrors(errors) {
    if (errors) {
      return {
        code: errors.error.errorCode._text,
        message: errors.error.errorText._text,
      };
    }
    return {};
  }

  async _send() {
    if (process.env.NODE_ENV === 'test') {
      const testResponse = this.testResponse();
      if (testResponse) return testResponse;
    }

    const data = querystring.stringify(this._payload);
    const response = await this.post(`/api/transact.php`, data);
    if (response) {
      return response;
    }
    throw new Error('Response is invalid');
  }

  async _query() {
    if (process.env.NODE_ENV === 'test') {
      const testResponse = this.testResponse();
      if (testResponse) return testResponse;
    }

    const data = querystring.stringify(this._payload);
    const response = await this.post(`/api/query.php`, data);
    if (response) {
      return response;
    }
    throw new Error('Response is invalid');
  }

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

module.exports = NMI;
