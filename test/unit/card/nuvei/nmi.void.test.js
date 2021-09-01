process.env.NODE_ENV = 'test';

const { uuid } = require('uuidv4');
const expect = require('chai').expect;
const gateway = require('../../../../src')({
  id: '1064771',
  secret: 'KEEW@vaub!bar6bley',
  environment: 'SANDBOX',
  gateway: 'NUVEI',
});

let data = null

describe('Nuvei', function () {
  describe('Credit Card - Void', function () {
    this.timeout(5000);
    let transaction = null;
    before(async () => {
      data = {
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
      };

      const res = await gateway.authorizeCreditCard(data);
      transaction = res.toJson();
    });

    it('should return a transaction id', async function () {
      const params = {
        transaction_id: transaction.response.transactionId,
        amount: data.amount
      };

      const res = await gateway.voidTransaction(params);
      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.response.transactionId).to.be.a('string');
    });

    // TODO: Add Error...
  });
});