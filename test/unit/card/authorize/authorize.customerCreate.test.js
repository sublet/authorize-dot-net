process.env.NODE_ENV = 'test';

const { uuid } = require('uuidv4');
const expect = require('chai').expect;
const gateway = require('../../../../src')({
  id: '8896Zak2B4vP',
  key: '24TrC2Hy999n63Yy',
  environment: 'SANDBOX',
  gateway: 'AUTHORIZE',
});

describe('Authorize.net', function () {
  describe('Customer - Create', function () {
    it('return a customer id', async function () {
      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0, 15),
        customer: {
          id: uuid().replace(/-/g, '').substr(0, 20),
          email: 'yoman@bob.com',
          description: 'Customer profile for Yoman Bob',
        },
        card: {
          number: '5424000000000015',
          code: '999',
          expiration: {
            month: '12',
            year: '2020',
          },
        },
        isTest: true,
      };

      const res = await gateway.createCustomer(data);
      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.response.customerId).to.be.a('string');
    });
  });
});
