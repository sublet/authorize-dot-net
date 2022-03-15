process.env.NODE_ENV = 'test';

const { uuid } = require('uuidv4');
const expect = require('chai').expect;
const gateway = require('../../../../src')({
  id: '1064771',
  key: 'KEEW@vaub!bar6bley',
  environment: 'SANDBOX',
  gateway: 'NUVEI',
});

describe('Nuvei', function () {
  this.timeout(5000);
  describe('Customer - Charge Card on File', function () {
    let customer;
    let referenceId;
    before(async () => {
      referenceId = uuid()
      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0, 15),
        merchant_ref: referenceId,
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
        access_key: 'e6f0592f258fba946e36a28319e575a0',
        reference_id: 'fccf79494125f8a7',
        merchant_ref: referenceId,
        card: {
          code: '123',
          number: '5411111111111115',
          expiration: { month: '12', year: '2022' },
          zip: '07052',
          name: 'Jeffrey Hunter'
        },
        customer: {
          firstName: 'Jeffrey',
          lastName: 'Hunter'
        },
        customer_id: '123456677'
      }

      const res = await gateway.customerUpdateCard(data);
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
