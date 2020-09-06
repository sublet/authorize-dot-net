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
  this.timeout(5000);
  describe('Customer - Authorize Card on File', function () {
    let customer;
    before(async () => {
      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0, 15),
        customer_vault_id: uuid(),
        card: {
          number: '5424000000000015',
          code: '999',
          expiration: {
            month: '12',
            year: '2020',
          },
        },
        customer: {
          id: uuid().replace(/-/g, '').substr(0, 20),
          email: 'yoman@bob.com',
          description: 'Customer profile for Yoman Bob',
          firstName: 'Yoman',
          lastName: 'Bob',
          address: '123 Somewhere St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA',
          phone: '2125551212',
        },
      };
      const res = await gateway.createCustomer(data);
      customer = res.toJson();
    });
    it('return a customer id', async function () {

      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0, 15),
        type: 'auth',
        amount: '386.12',
        customer_vault_id: customer.response.customerId
      };

      const res = await gateway.customerAuthorizeTransaction(data);

      const results = res.toJson();

      console.log(results)

      expect(results.isSuccess).to.be.true;
      expect(results.referenceId).to.be.equal(data.reference_id);
      expect(results.response.customerId).to.be.a('string');
      expect(results.response.customerId).to.be.equal(customer.response.customerId);
    });
  });
});
