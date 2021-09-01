process.env.NODE_ENV = 'test';

const { uuid } = require('uuidv4');
const expect = require('chai').expect;
const gateway = require('../../../../src')({
  id: '1064771',
  secret: 'KEEW@vaub!bar6bley',
  environment: 'SANDBOX',
  gateway: 'NUVEI',
});

describe.skip('NUVEI', function () {
  this.timeout(5000);
  describe('Credit Card - Capture', function () {
    let authorization;
    before(async () => {
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

      const res = await gateway.authorizeCreditCard(authorizeData);
      authorization = res.toJson();
    });
    it('should return a transaction id', async function () {
      expect(authorization.isSuccess).to.be.true;

      const {
        referenceId,
        response: { authorizationCode },
      } = authorization;

      const data = {
        reference_id: referenceId,
        amount: '386.12',
        transaction_id: authorizationCode,
        invoice_number: uuid().replace(/-/g, '').substr(0, 15),
      };

      const res = await gateway.captureCreditCard(data);
      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.referenceId).to.be.equal(data.reference_id);
      expect(results.response.transactionId).to.be.a('string');
    });

    // TODO: Add Error...
  });
});
