process.env.NODE_ENV = 'test';

const { uuid } = require('uuidv4');
const expect = require('chai').expect;
const gateway = require('../../../../src')({
  id: null,
  key: '6457Thfj624V5r7WUwc5v6a68Zsd6YEm',
  environment: 'SANDBOX',
  gateway: 'NMI',
});

const currentPlanId = uuid();

describe('NMI', function () {
  describe('Recurring - Plan Create', function () {
    it('return a successful response', async function () {
      const data = {
        plan_payments: 4,
        plan_amount: 250.5,
        plan_name: 'Payment Plan for Yoman Bob',
        plan_id: currentPlanId,
        frequency_type: 'DAYS',
        frequency_amount: 7,
      };

      const res = await gateway.createRecurringPlan(data);

      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.response.message).to.be.equal('Plan Added');
    });
    it('return an error due to not having required fields', async function () {
      const data = {
        plan_payments: 4,
      };

      try {
        await gateway.createRecurringPlan(data);
        expect(true, 'This worked when it should not have').to.be.equal(false);
      } catch (e) {
        expect(e.message).to.be.equal('plan_amount is a required value');
      }
    });
    it('return an error due to not having required fields', async function () {
      const data = {
        plan_payments: '4',
        plan_amount: 250.5,
        plan_name: 'Payment Plan for Yoman Bob',
        plan_id: uuid(),
        frequency_type: 'DAYS',
        frequency_amount: 7,
      };

      try {
        await gateway.createRecurringPlan(data);
        expect(true, 'This worked when it should not have').to.be.equal(false);
      } catch (e) {
        expect(e.message).to.be.equal('plan_payments must be an Integer: 4');
      }
    });
  });
  describe('Recurring - Plan Edit', function () {
    it('return...', async function () {
      const data = {
        current_plan_id: currentPlanId,
        plan_payments: 10,
        plan_amount: 100.0,
      };

      const res = await gateway.editRecurringPlan(data);

      const results = res.toJson();

      expect(results.isSuccess).to.be.true;
      expect(results.response.message).to.be.equal('Plan Edit Successful');
    });
  });
});
