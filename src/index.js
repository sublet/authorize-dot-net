const authorize = require('./lib/authorize');
const Fetch = require('./lib/base/fetch');

const gateways = ['AUTHORIZE', 'NMI'];
const gatewayTypes = ['SANDBOX', 'PRODUCTION'];

class PaymentGateway extends Fetch {
  constructor(config) {
    super();

    if (!config.login_id) throw new Error('Login ID is invalid');
    if (!config.transaction_key) throw new Error('Transaction Key is invalid');

    this._gateway = null;

    this._config = config;
    this._config.uri = null;
    this._config.gateway = this._config.gateway ? this._config.gateway : null;
    this._config.gatewayType = this._config.gateway_type
      ? this._config.gateway_type
      : null;

    this._setGatewayUri();
  }

  setGatewayType(type) {
    if (gatewayTypes.indexOf(type) < 0)
      throw new Error('Gateway Type is invalid');
    this._config.gatewayType = type;
    this._setGatewayUri();
  }

  setGateway(gateway) {
    if (gateways.indexOf(gateway) < 0) throw new Error('Gateway is invalid');
    this._config.gateway = gateway;
    this._setGatewayUri();
  }

  _setGatewayUri() {
    if (this._config.gateway && this._config.gatewayType) {
      let uri = null;
      if (this._config.gateway === 'AUTHORIZE') {
        this._gateway = authorize;
        uri =
          this._config.gatewayType === 'PRODUCTION'
            ? 'https://api.authorize.net/xml'
            : 'https://apitest.authorize.net/xml';
      } else if (this._config.gateway === 'NMI') {
        // this._gateway = nmi
        uri =
          this._config.gatewayType === 'PRODUCTION' ? 'PRODUCTION' : 'SANDBOX';
      }
      this._config.uri = uri;
    }
  }

  get gateway() {
    return this._gateway;
  }

  /**
   *
   * Authorize and Charge a Credit card all at once.
   *
   * @method chargeCreditCard
   *
   * @param {Object} data
   * @param {String} data.reference_id
   * @param {String} data.amount
   * @param {String} data.invoice_number
   * @param {Object} data.card
   * @param {String} data.card.number
   * @param {String} data.card.code
   * @param {String} data.card.expiration
   * @param {String} data.card.expiration.month
   * @param {String} data.card.expiration.year
   */

  async chargeCreditCard(data) {
    const response = await authorize.card.charge.process(data, this._config);
    if (response) {
      return response;
    }
    throw new Error('There was a problem charging the card.');
  }

  /**
   *
   * Authorize a card
   *
   * @method authorizeCreditCard
   *
   * @param {Object} data
   * @param {String} data.reference_id
   * @param {String} data.amount
   * @param {String} data.invoice_number
   * @param {Object} data.card
   * @param {String} data.card.number
   * @param {String} data.card.code
   * @param {String} data.card.expiration
   * @param {String} data.card.expiration.month
   * @param {String} data.card.expiration.year
   */

  async authorizeCreditCard(data) {
    const response = await authorize.card.authorize.process(data, this._config);
    if (response) {
      return response;
    }
    throw new Error('There was a problem authorizing the card.');
  }

  /**
   *
   * Capture an already authorized credit card.
   *
   * @method captureCreditCard
   *
   * @param {Object} data
   * @param {String} data.reference_id
   * @param {String} data.amount
   * @param {String} data.invoice_number
   * @param {String} data.transaction_id
   */
  async captureCreditCard(data) {
    const response = await authorize.card.capture.process(data, this._config);
    if (response) {
      return response;
    }
    throw new Error('There was a problem authorizing the card.');
  }
}

module.exports = config => new PaymentGateway(config);
