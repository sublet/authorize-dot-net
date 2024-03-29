const Fetch = require('./lib/base/fetch');

// const authorize = require('./lib/authorize');
const nmi = require('./lib/nmi');
const nuvei = require('./lib/nuvei');

const gateways = ['AUTHORIZE', 'NMI'];
const environments = ['SANDBOX', 'PRODUCTION'];

class PaymentGateway extends Fetch {
  constructor(config) {
    super();

    if (!config.gateway) throw new Error('Gateway is invalid');
    if (!config.environment) throw new Error('Environment is invalid');

    if (config.gateway === 'NMI') {
      if (!config.key) throw new Error('Key is invalid');
    } else if (config.gateway === 'AUTHORIZE') {
      if (!config.id) throw new Error('Login ID is invalid');
      if (!config.key) throw new Error('Key is invalid');
      config.login_id = config.id;
      config.transaction_key = config.key;
      delete config.id;
      delete config.key;
    } else if (config.gateway === 'NUVEI') {
      if (!config.id) throw new Error('Gateway ID is invalid');
      if (!config.key) throw new Error('Gateway Secret is invalid');
      config.terminal_id = config.id;
      config.secret = config.key;
      delete config.id;
    }

    this._gateway = null;

    this._config = config;
    this._config.uri = null;

    this._setGatewayUri();
  }

  resetGateway(config) {
    if (!config.gateway) throw new Error('Gateway is invalid');
    if (!config.environment) throw new Error('Environment is invalid');

    if (config.gateway === 'NMI') {
      if (!config.key) throw new Error('Key is invalid');
    } else if (config.gateway === 'AUTHORIZE') {
      if (!config.id) throw new Error('Login ID is invalid');
      if (!config.key) throw new Error('Key is invalid');
      config.login_id = config.id;
      config.transaction_key = config.key;
      delete config.id;
      delete config.key;
    } else if (config.gateway === 'NUVEI') {
      if (!config.id) throw new Error('Gateway ID is invalid');
      if (!config.key) throw new Error('Gateway Secret is invalid');
      config.terminal_id = config.id;
      config.secret = config.key;
      delete config.id;
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
        // this._gateway = authorize;
        // uri =
        //   this._config.environment === 'PRODUCTION'
        //     ? 'https://api.authorize.net/xml'
        //     : 'https://apitest.authorize.net/xml';
      } else if (this._config.gateway === 'NMI') {
        this._gateway = nmi;
        uri = 'https://secure.networkmerchants.com';
      } else if (this._config.gateway === 'NUVEI') {
        this._gateway = nuvei;
        uri =
          this._config.environment === 'PRODUCTION'
            ? 'https://payments.nuvei.com/merchant/xmlpayment'
            : 'https://testpayments.nuvei.com/merchant/xmlpayment';
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
    throw new Error('There was a problem capturing the card.');
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
    throw new Error('There was a problem running the return.');
  }

  /**
   *
   * @CreditCard
   * Void a Transaction
   *
   * @method refundTransaction
   *
   * @param {Object} data
   * @param {String} data.transaction_id
   */
  async voidTransaction(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.card.void.process(data, this._config);
    if (response) {
      return response;
    }
    throw new Error('There was a problem voiding the card.');
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
   * @param {String} data.amount
   * @param {String} data.customer_vault_id
   * @param {String} data.order_id
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
   * @Customer
   * Charge Transaction without Authorization
   *
   * @method customerChargeTransaction
   *
   * @param {Object} data
   * @param {String} data.reference_id
   * @param {String} data.amount
   * @param {String} data.customer_vault_id
   * @param {String} data.order_id
   * @param {String} data.initiated_by
   * @param {String} data.stored_credential_indicator
   */
  async customerChargeTransaction(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.customer.charge.process(
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
   * Validate Customer card without actually authorizing the charge
   *
   * @method customerCardValidate
   *
   * @param {Object} data
   * @param {String} data.reference_id
   * @param {String} data.amount
   * @param {String} data.customer_vault_id
   * @param {String} data.order_id
   * @param {String} data.initiated_by
   * @param {String} data.stored_credential_indicator
   */
  async customerCardValidate(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.customer.validate.process(
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
   * Update Customer Card on File
   *
   * @method customerUpdateCard
   *
   * @param {Object} data
   * @param {String} data.reference_id
   * @param {String} data.amount
   * @param {String} data.customer_vault_id
   * @param {String} data.order_id
   * @param {String} data.initiated_by
   * @param {String} data.stored_credential_indicator
   */
  async customerUpdateCard(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.customer.update.process(
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

  /**
   *
   * @Recurring
   * Create a Recurring Plan
   *
   * @method createRecurringPlan
   *
   * @param {Object} data
   * @param {Integer} data.plan_payments
   * @param {Float} data.plan_amount
   * @param {String} data.plan_name
   * @param {String} data.plan_id
   * @param {Enum} data.frequency_type
   * @param {Integer} data.frequency_amount
   */
  async createRecurringPlan(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.recurring.create_plan.process(
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
   * @Recurring
   * Edit a Recurring Plan
   *
   * @method editRecurringPlan
   *
   * @param {Object} data
   * @param {String} data.current_plan_id
   * @param {Integer} data.plan_payments
   * @param {Float} data.plan_amount
   * @param {String} data.plan_name
   * @param {String} data.plan_id
   * @param {Enum} data.frequency_type
   * @param {Integer} data.frequency_amount
   */
  async editRecurringPlan(data) {
    if (!this._gateway) throw new Error('Gateway not set.');

    const response = await this._gateway.recurring.edit_plan.process(
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
