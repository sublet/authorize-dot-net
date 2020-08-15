process.env.NODE_ENV = 'test';

const { uuid } = require('uuidv4');
const expect = require('chai').expect;
const gateway = require('../../../../src')({
  id: null,
  key: '6457Thfj624V5r7WUwc5v6a68Zsd6YEm',
  environment: 'SANDBOX',
  gateway: 'NMI',
});

describe('NMI', function () {
  describe('Credit Card - Charge', function () {
    it.only('should return a transaction id', async function () {
      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0, 15),
        amount: '386.12',
        invoice_number: uuid().replace(/-/g, '').substr(0, 15),
        card: {
          number: '5424000000000015',
          code: '999',
          expiration: {
            month: '12',
            year: '2020',
          },
        },
        billing: {
          firstName: 'Yoman',
          lastName: 'Bob',
          address: '123 Somewhere St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA',
        },
        email: 'sublet@me.com',
        phone: '9783353373',
      };

      const res = await gateway.chargeCreditCard(data);
      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.referenceId).to.be.equal(data.reference_id);
      expect(results.response.transactionId).to.be.a('string');
    });

    // TODO: Add Error...
  });
});
