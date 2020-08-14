process.env.NODE_ENV = 'test';

const { uuid } = require('uuidv4')
const expect = require('chai').expect;
const authorize = require('../../../src')({ login_id: '8896Zak2B4vP', transaction_key: '24TrC2Hy999n63Yy' });

describe('Credit Card', () => {
  describe('Charge', () => {
    it('should return a successful transaction payload', async () => {
      authorize.setSandbox()

      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0,15),
        amount: '386.12',
        invoice_number: uuid().replace(/-/g, '').substr(0,15),
        card: {
          number: '5424000000000015',
          code: '999',
          expiration: {
            month: '12',
            year: '2020'
          }
        },
        billing: {
          firstName: 'Yoman',
          lastName: 'Bob',
          address: '123 Somewhere St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        }
      }

      const res = await authorize.chargeCreditCard(data)
      const results = res.toJson()

      expect(results.isSuccess).to.be.true;
      expect(results.referenceId).to.be.equal(data.reference_id)

    });

    // TODO: Add Error...

  });

  describe('Authorize', () => {
    it('should return a successful transaction payload', async () => {
      authorize.setSandbox()
  
      const data = {
        reference_id: uuid().replace(/-/g, '').substr(0,15),
        amount: '386.12',
        invoice_number: uuid().replace(/-/g, '').substr(0,15),
        card: {
          number: '5424000000000015',
          code: '999',
          expiration: {
            month: '12',
            year: '2020'
          }
        },
        billing: {
          firstName: 'Yoman',
          lastName: 'Bob',
          address: '123 Somewhere St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        }
      }
  
      const res = await authorize.chargeCreditCard(data)
      const results = res.toJson()
  
      expect(results.isSuccess).to.be.true;
      expect(results.referenceId).to.be.equal(data.reference_id)
  
    });

    // TODO: Add Error...
    
  });
});
