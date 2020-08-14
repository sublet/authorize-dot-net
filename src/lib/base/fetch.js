const Promise = require("bluebird");
const axios = require("axios");

class Fetch {
  host() {
    throw new Error("Must be overriden.");
  }

  get axios() {
    return axios;
  }

  async _request(method, path, params = null) {
    const ops = {
      url: `${this.host()}${path}`,
      method: method,
      headers: this.getHeaders(),
    };

    let fullResponse = false;
    if (params && params.fullResponse) {
      fullResponse = true;
      delete params.fullResponse;
    }
    if (params) ops.data = params;

    let results = await Promise.resolve(axios.request(ops));
    return fullResponse ? results : results.data;
  }

  getHeaders() {
    return {
      "Content-Type": "text/xml",
    };
  }

  async get(url, params = null) {
    return await this._request("GET", url, params);
  }

  async post(url, params = null) {
    return await this._request("POST", url, params);
  }

  async put(url, params = null) {
    return await this._request("PUT", url, params);
  }

  async delete(url, params = null) {
    return await this._request("DELETE", url, params);
  }

  _buildQueryStringFromJSON(params) {
    var str = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");
    return str ? "?" + str : "";
  }
}

module.exports = Fetch;
