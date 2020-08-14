const authorize = require("./lib");
const Fetch = require("./lib/base/fetch");

class AuthorizeDotNet extends Fetch {
  constructor(config) {
    super();

    if (!config.login_id) throw new Error("Login ID is invalid");
    if (!config.transaction_key) throw new Error("Transaction Key is invalid");

    this._config = config;
    this._config.uri = "https://api.authorize.net/xml";
  }

  setSandbox() {
    this._config.uri = "https://apitest.authorize.net/xml";
  }

  async chargeCreditCard(data) {
    const response = await authorize.card.charge.process(data, this._config);
    if (response) {
      return response;
    }
    throw new Error("There was a problem charging the card.");
  }

  async authorizeCreditCard(data) {
    const response = await authorize.card.authorize.process(data, this._config);
    if (response) {
      return response;
    }
    throw new Error("There was a problem authorizing the card.");
  }

  async captureCreditCard(data) {
    const response = await authorize.card.capture.process(data, this._config);
    if (response) {
      return response;
    }
    throw new Error("There was a problem authorizing the card.");
  }
}

module.exports = (config) => new AuthorizeDotNet(config);
