process.env.NODE_ENV = 'test';

const { uuid } = require('uuidv4');
const expect = require('chai').expect;
const gateway = require('../../../../src')({
  id: null,
  key: '6457Thfj624V5r7WUwc5v6a68Zsd6YEm', // 6457Thfj624V5r7WUwc5v6a68Zsd6YEm
  environment: 'SANDBOX',
  gateway: 'NMI',
});

// https://secure.networkmerchants.com/gw/merchants/resources/integration/integration_portal.php#query_variables

describe('NMI', function () {
  describe('Transaction - Search', function () {
    it('find transctions', async function () {
      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0, 15),
        transaction_type: 'cc',
      };

      const res = await gateway.fetchTransactions(data);

      const results = res.toJson();

      // console.log(results)

      expect(results.isSuccess).to.be.false;
      // expect(results.referenceId).to.be.equal(data.reference_id);
      // expect(results.response.customerId).to.be.a('string');
    });
  });
});
