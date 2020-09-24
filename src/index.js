const Fetch = require('./lib/base/fetch');

const authorize = require('./lib/authorize');
const nmi = require('./lib/nmi');

const gateways = ['AUTHORIZE', 'NMI'];
const environments = ['SANDBOX', 'PRODUCTION'];

class PaymentGateway extends Fetch {
  constructor(config) {
    super();

    if (!config.key) throw new Error('Key is invalid');
    if (!config.gateway) throw new Error('Gateway is invalid');
    if (!config.environment) throw new Error('Environment is invalid');
    if (config.gateway === 'AUTHORIZE') {
      if (!config.id) throw new Error('Login ID is invalid');
      config.login_id = config.id;
      config.transaction_key = config.key;
      delete config.id;
      delete config.key;
    }

    this._gateway = null;

    this._config = config;
    this._config.uri = null;

    this._setGatewayUri();
  }

  setEnvironment(environment) {
    if (environments.indexOf(environment) < 0)
      throw new Error('Environment is invalid');
    this._config.environment = environment;
    this._setGatewayUri();
  }

  setGateway(gateway) {
    if (gateways.indexOf(gateway) < 0) throw new Error('Gateway is invalid');
    this._config.gateway = gateway;
    this._setGatewayUri();
  }

  _setGatewayUri() {
    if (this._config.gateway && this._config.environment) {
      let uri = null;
      if (this._config.gateway === 'AUTHORIZE') {
        this._gateway = authorize;
        uri =
          this._config.environment === 'PRODUCTION'
            ? 'https://api.authorize.net/xml'
            : 'https://apitest.authorize.net/xml';
      } else if (this._config.gateway === 'NMI') {
        this._gateway = nmi;
        uri = 'https://secure.networkmerchants.com';
      }
      this._config.uri = uri;
    }
  }

  get gateway() {
    return this._gateway;
  }

  /**
   *
   * @CreditCard
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
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.card.charge.process(
      data,
      this._config,
    );
    if (response) {
      return response;
    }
    throw new Error('There was a problem charging the card.');
  }

  /**
   *
   * @CreditCard
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
   * @param {String} data.billing.firstName
   * @param {String} data.billing.lastName
   */

  async authorizeCreditCard(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.card.authorize.process(
      data,
      this._config,
    );
    if (response) {
      return response;
    }
    throw new Error('There was a problem authorizing the card.');
  }

  /**
   *
   * @CreditCard
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
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.card.capture.process(
      data,
      this._config,
    );
    if (response) {
      return response;
    }
    throw new Error('There was a problem authorizing the card.');
  }

  /**
   *
   * @CreditCard
   * Refund a Transaction
   *
   * @method refundTransaction
   *
   * @param {Object} data
   * @param {String} data.transaction_id
   */
  async refundTransaction(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.card.refund.process(
      data,
      this._config,
    );
    if (response) {
      return response;
    }
    throw new Error('There was a problem authorizing the card.');
  }

  /**
   *
   * @Customer
   * Create a Customer
   *
   * @method createCustomer
   *
   * @param {Object} data
   * @param {String} data.reference_id
   * @param {String} data.amount
   * @param {String} data.invoice_number
   * @param {String} data.transaction_id
   */
  async createCustomer(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.customer.create.process(
      data,
      this._config,
    );
    if (response) {
      return response;
    }
    throw new Error('There was a problem authorizing the card.');
  }

  /**
   *
   * @Customer
   * Create a Customer
   *
   * @method customerAuthorizeTransaction
   *
   * @param {Object} data
   * @param {String} data.reference_id
   * @param {String} data.type
   * @param {String} data.amount
   * @param {String} data.customer_vault_id
   * @param {String} data.initiated_by
   * @param {String} data.stored_credential_indicator
   */
  async customerAuthorizeTransaction(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.customer.authorize.process(
      data,
      this._config,
    );
    if (response) {
      return response;
    }
    throw new Error('There was a problem authorizing the card.');
  }

  /**
   *
   * @Transaction
   * Find Transactions
   *
   * @method fetchTransactions
   *
   * @param {Object} data
   */
  async fetchTransactions(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.transaction.search.search(
      data,
      this._config,
    );
    if (response) {
      return response;
    }
    throw new Error('There was a problem authorizing the card.');
  }
}

module.exports = config => new PaymentGateway(config);
