const ejs = require('ejs');
const axios = require('axios');
const sha512 = require('js-sha512').sha512;
const parser = require('fast-xml-parser');

const {
  config: { nuvie },
} = require('../../../../app');

class Base {
  // Overrides

  process() {
    throw new Error('Must override the buildHash method.');
  }

  buildHash() {
    throw new Error('Must override the buildHash method.');
  }

  async _request(method, params, headers = {}) {
    const ops = {
      url: nuvie.uri,
      method: method,
      data: params,
      headers: headers,
    };

    try {
      return Promise.resolve(axios.request(ops));
    } catch (e) {
      console.log('error: ', e.response);
      if (e.response && e.response.data) {
        const { statusCode, error, message } = e.response.data;
        throw new Error(`${statusCode} ${error} - ${message}`);
      }
      throw new Error('General Connection Error');
    }
  }

  async _query(url, method, headers = {}) {
    // https://api.nuvei.com/merchant/api/Transactions/GetCreditTransactions?startDate=2021-05-01&endDate=2021-06-15
    const ops = {
      url: `https://api.nuvei.com${url}`,
      auth: {
        username: 'Simplybailreporting',
        password: '6dKiorG!',
      },
      method: method,
      headers: headers,
    };

    try {
      let results = await Promise.resolve(axios.request(ops));
      return results;
    } catch (e) {
      console.log('error: ', e);
      if (e.response && e.response.data) {
        const { statusCode, error, message } = e.response.data;
        throw new Error(`${statusCode} ${error} - ${message}`);
      }
      throw new Error('General Connection Error');
    }
  }

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

  _generateHash(str) {
    return sha512(`${nuvie.terminalId}:${str}:${nuvie.secret}`);
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

  _getType() {
    // VISA
    // VISA DEBIT
    // ELECTRON
    // MASTERCARD
    // DEBIT MASTERCARD
    // MAESTRO
    // LASER
    // AMEX
    // DINERS
    // JCB
    // DISCOVER
    // CUP SECUREPAY
  }
}

module.exports = Base;
