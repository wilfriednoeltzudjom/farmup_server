const buildCreateCustomerUseCase = require('../use_cases/customers/create-customer.usecase');
const buildUpdateCustomerUseCase = require('../use_cases/customers/update-customer.usecase');
const buildGetCustomersUseCase = require('../use_cases/customers/get-customers.usecase');
const buildGetCustomersAnalyticsUseCase = require('../use_cases/customers/get-customers-analytics.usecase');
const buildGetCustomerUseCase = require('../use_cases/customers/get-customer.usecase');
const buildDeleteCustomerUseCase = require('../use_cases/customers/delete-customer.usecase');
const HttpResponse = require('../application/payloads/http-response');
const { customerMessages } = require('../application/messages');

module.exports = function buildCustomerController(dependencies) {
  const createCustomerUseCase = buildCreateCustomerUseCase(dependencies);
  const updateCustomerUseCase = buildUpdateCustomerUseCase(dependencies);
  const getCustomersUseCase = buildGetCustomersUseCase(dependencies);
  const getCustomersAnalyticsUseCase = buildGetCustomersAnalyticsUseCase(dependencies);
  const getCustomerUseCase = buildGetCustomerUseCase(dependencies);
  const deleteCustomerUseCase = buildDeleteCustomerUseCase(dependencies);

  async function createCustomer(request) {
    const customer = await createCustomerUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.created({
      message: customerMessages.CUSTOMER_CREATED.FR,
      data: customer,
    });
  }

  async function updateCustomer(request) {
    const customer = await updateCustomerUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: customerMessages.CUSTOMER_UPDATED.FR,
      data: customer,
    });
  }

  async function getCustomers(request) {
    const customers = await getCustomersUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: customers,
    });
  }

  async function getCustomersAnalytics(request) {
    const analytics = await getCustomersAnalyticsUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: analytics,
    });
  }

  async function getCustomer(request) {
    const customer = await getCustomerUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: customer,
    });
  }

  async function deleteCustomer(request) {
    const customer = await deleteCustomerUseCase.execute(request.params);

    return HttpResponse.succeeded({
      message: customerMessages.CUSTOMER_DELETED(customer).FR,
      data: customer,
    });
  }

  return { createCustomer, updateCustomer, getCustomers, getCustomersAnalytics, getCustomer, deleteCustomer };
};
