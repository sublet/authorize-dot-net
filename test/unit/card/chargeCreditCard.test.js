process.env.NODE_ENV = 'test';

const { uuid } = require('uuidv4');
const expect = require('chai').expect;
const authorize = require('../../../src')({
  login_id: '8896Zak2B4vP',
  transaction_key: '24TrC2Hy999n63Yy',
});

describe('Credit Card', function () {
  describe('Charge', function () {
    it('should return a successful transaction payload', async function () {
      authorize.setSandbox();

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
      };

      const res = await authorize.chargeCreditCard(data);
      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.referenceId).to.be.equal(data.reference_id);
    });

    // TODO: Add Error...
  });

  describe('Authorize', function () {
    it('should return a successful transaction payload', async function () {
      authorize.setSandbox();

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
      };

      const res = await authorize.authorizeCreditCard(data);
      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.referenceId).to.be.equal(data.reference_id);
      expect(results.response.transactionId).to.be.a('string');
    });

    // TODO: Add Error...
  });

  describe('Capture', function () {
    let authorization;
    before(async () => {
      authorize.setSandbox();

      const authorizeData = {
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

      const res = await authorize.authorizeCreditCard(authorizeData);
      authorization = res.toJson();
    });
    it('should return a successful transaction payload', async () => {
      expect(authorization.isSuccess).to.be.true;

      const {
        referenceId,
        response: { transactionId },
      } = authorization;

      const data = {
        reference_id: referenceId,
        amount: '212.12',
        transaction_id: transactionId,
        invoice_number: uuid().replace(/-/g, '').substr(0, 15),
      };

      const res = await authorize.captureCreditCard(data);
      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.referenceId).to.be.equal(data.reference_id);
      expect(results.response.transactionId).to.be.a('string');
    });

    // TODO: Add Error...
  });
});
