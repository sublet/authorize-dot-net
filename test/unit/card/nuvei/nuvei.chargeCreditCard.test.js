process.env.NODE_ENV = 'test';

const { uuid } = require('uuidv4');
const expect = require('chai').expect;
const gateway = require('../../../../src')({
  id: '1064771',
  secret: 'KEEW@vaub!bar6bley',
  environment: 'SANDBOX',
  gateway: 'NUVEI',
});

describe('Nuvei', function () {
  // this.timeout(10000)
  describe('Credit Card - Charge', function () {
    it('should return a transaction id', async function () {
      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0, 15),
        amount: '386.12',
        invoice_number: uuid().replace(/-/g, '').substr(0, 15),
        card: {
          number: '4111111111111111',
          code: '123',
          expiration: {
            month: '12',
            year: '2022',
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
        email: 'yoman@bob.com',
        phone: '2125551212',
        // customer_vault: 'add_customer',
      };

      const res = await gateway.chargeCreditCard(data);
      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.referenceId).to.be.equal(data.reference_id);
      expect(results.response.transactionId).to.be.a('string');
    });
  });
});
