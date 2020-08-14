const _ = require('lodash')
const deepExtend = require('deep-extend')
const path = require('path')
const ejs = require('ejs')
const convert = require('xml-js')
const Fetch = require('./fetch')

const mapping = {
  'CREATE_TRANSACTION': '../ejs/credit_card/create_transaction.ejs',
  'AUTHORIZE_TRANSACTION': '../ejs/credit_card/authorize_transaction.ejs'
}

class Base extends Fetch {
  
  constructor(type) {
    super()

    this._response = null
    this._payload = null
    this._uri = null
    this._filePath = path.resolve(__dirname, mapping[type])
  }

  // Overwrites

  host() {
    return this._uri
  }

  default() {
    throw new Error('Must inherit this.')
  }

  toJson() {
    throw new Error('Must inherit this.')
  }

  // Methods

  async process(data, config) {
    this._uri = config.uri
    data = _.extend(data, config)
    data = deepExtend(this.default(), data)
    this._payload = await this._buildPayload(data)
    if (this._payload) {
      this._response = await this._send(this._payload)
      return this
    }
    throw new Error('Payload could not be generated.')
  }

  get payload() {
    return this._payload
  }

  get response() {
    return this._response
  }

  // private

  _convertResponseToJson() {
    return JSON.parse(convert.xml2json(this._response, {compact: true, spaces: 4}))
  }

  _jsonMessages(messages) {
    return {
      responseCode: messages.resultCode._text,
      code: messages.message.code._text,
      message: messages.message.text._text
    }
  }

  _jsonErrors(errors) {
    if (errors) {
      return {
        code: errors.error.errorCode._text,
        message: errors.error.errorText._text
      }
    }
    return {}
  }

  async _send(xmlData) {
    const response = await this.post(`/v1/request.api`, xmlData)
    if (response) {
      return response
    }
    throw new Error('Response is invalid')
  }

  _buildPayload(data) {
    return this._getFile(this._filePath, data)
  }

  _getFile(filePath, data) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(filePath, data, (err, str) => {
        if (err) reject(err)
        resolve(str)
      })
    })
  }

}

module.exports = Base