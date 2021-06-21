const Recurring_PlanCreate = require('./createPlan');
const Recurring_PlanEdit = require('./editPlan');

module.exports = {
  create_plan: new Recurring_PlanCreate('CREATE_RECURRING_PLAN'),
  edit_plan: new Recurring_PlanEdit('CREATE_RECURRING_PLAN'),
};
