const buildCreateSupplierUseCase = require('../use_cases/suppliers/create-supplier.usecase');
const buildUpdateSupplierUseCase = require('../use_cases/suppliers/update-supplier.usecase');
const buildGetSuppliersUseCase = require('../use_cases/suppliers/get-suppliers.usecase');
const buildGetSuppliersAnalyticsUseCase = require('../use_cases/suppliers/get-suppliers-analytics.usecase');
const buildGetSupplierUseCase = require('../use_cases/suppliers/get-supplier.usecase');
const buildDeleteSupplierUseCase = require('../use_cases/suppliers/delete-supplier.usecase');
const HttpResponse = require('../application/payloads/http-response');
const { supplierMessages } = require('../application/messages');

module.exports = function buildSupplierController(dependencies) {
  const createSupplierUseCase = buildCreateSupplierUseCase(dependencies);
  const updateSupplierUseCase = buildUpdateSupplierUseCase(dependencies);
  const getSuppliersUseCase = buildGetSuppliersUseCase(dependencies);
  const getSuppliersAnalyticsUseCase = buildGetSuppliersAnalyticsUseCase(dependencies);
  const getSupplierUseCase = buildGetSupplierUseCase(dependencies);
  const deleteSupplierUseCase = buildDeleteSupplierUseCase(dependencies);

  async function createSupplier(request) {
    const supplier = await createSupplierUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.created({
      message: supplierMessages.SUPPLIER_CREATED.FR,
      data: supplier,
    });
  }

  async function updateSupplier(request) {
    const supplier = await updateSupplierUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: supplierMessages.SUPPLIER_UPDATED.FR,
      data: supplier,
    });
  }

  async function getSuppliers(request) {
    const suppliers = await getSuppliersUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: suppliers,
    });
  }

  async function getSuppliersAnalytics(request) {
    const analytics = await getSuppliersAnalyticsUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: analytics,
    });
  }

  async function getSupplier(request) {
    const supplier = await getSupplierUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: supplier,
    });
  }

  async function deleteSupplier(request) {
    const supplier = await deleteSupplierUseCase.execute(request.params);

    return HttpResponse.succeeded({
      message: supplierMessages.SUPPLIER_DELETED(supplier).FR,
      data: supplier,
    });
  }

  return { createSupplier, updateSupplier, getSuppliers, getSuppliersAnalytics, getSupplier, deleteSupplier };
};
