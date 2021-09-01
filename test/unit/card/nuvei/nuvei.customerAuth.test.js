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
  this.timeout(5000);
  describe('Customer - Authorize Card on File', function () {
    let customer;
    before(async () => {
      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0, 15),
        merchant_ref: uuid(),
        card: {
          number: '4111111111111111',
          code: '123',
          expiration: {
            month: '12',
            year: '2022',
          },
        },
        customer: {
          id: uuid().replace(/-/g, '').substr(0, 20),
          email: 'bob@yoman.com',
          description: 'Customer profile for Bob Yoman',
          firstName: 'Bob',
          lastName: 'Yoman',
        },
      };
      const res = await gateway.createCustomer(data);
      customer = res.toJson();
    });
    it('return a customer id', async function () {
      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0, 15),
        amount: '386.12',
        customer_vault_id: customer.response.customerId,
        zip: '07052',
      };

      const res = await gateway.customerAuthorizeTransaction(data);
      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.referenceId).to.be.equal(data.reference_id);
      expect(results.response.customerId).to.be.a('string');
      expect(results.response.customerId).to.be.equal(
        customer.response.customerId,
      );
    });
  });
});
