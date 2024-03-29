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
  describe('Credit Card - Refund', function () {
    this.timeout(5000);

    let transaction = null;
    before(async () => {
      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0, 15),
        amount: '386.11',
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
        email: 'yoman@bob.com',
        phone: '2125551212',
      };

      const res = await gateway.chargeCreditCard(data);
      transaction = res.toJson();
    });

    it('should return a transaction id', async function () {
      const data = {
        transaction_id: transaction.response.transactionId,
        custom_fields: [
          { key: 'transaction_id', value: transaction.response.transactionId },
          { key: 'case_id', value: uuid() },
        ],
      };

      const res = await gateway.refundTransaction(data);
      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.response.transactionId).to.be.a('string');
    });
  });
});
