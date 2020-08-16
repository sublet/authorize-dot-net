const _ = require('lodash');
const deepExtend = require('deep-extend');
const path = require('path');
const ejs = require('ejs');
const convert = require('xml-js');
const Fetch = require('./fetch');

const mapping = {
  CREATE_TRANSACTION: '../authorize/ejs/credit_card/create.ejs',
  AUTHORIZE_TRANSACTION: '../authorize/ejs/credit_card/authorize.ejs',
  CAPTURE_TRANSACTION: '../authorize/ejs/credit_card/capture.ejs',
};

class Authorize extends Fetch {
  constructor(type) {
    super();

    this._type = type;
    this._response = null;
    this._payload = null;
    this._uri = null;
    this._filePath = path.resolve(__dirname, mapping[type]);

    this._debug = process.env.DEBUG === 'true';
  }

  // Overwrites

  host() {
    return this._uri;
  }

  default() {
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
    if (process.env.NODE_ENV === 'test') this._referenceId = data.reference_id;
    data = _.extend(data, config);
    data = deepExtend(this.default(), data);
    this._payload = await this._buildPayload(data);
    if (this._payload) {
      this._response = await this._send(this._payload);
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

  _convertResponseToJson() {
    return JSON.parse(
      convert.xml2json(this._response, { compact: true, spaces: 4 }),
    );
  }

  _convertPayloadToJson() {
    return JSON.parse(
      convert.xml2json(this._payload, { compact: true, spaces: 4 }),
    );
  }

  _jsonMessages(messages) {
    return {
      responseCode: messages.resultCode._text,
      code: messages.message.code._text,
      message: messages.message.text._text,
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

  async _send(xmlData) {
    if (process.env.NODE_ENV === 'test') return this.testResponse()

    const response = await this.post(`/v1/request.api`, xmlData);
    if (response) {
      return response;
    }
    throw new Error('Response is invalid');
  }

  _buildPayload(data) {
    return this._getFile(this._filePath, data);
  }

  _getFile(filePath, data) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(filePath, data, (err, str) => {
        if (err) reject(err);
        resolve(str);
      });
    });
  }
}

module.exports = Authorize;
