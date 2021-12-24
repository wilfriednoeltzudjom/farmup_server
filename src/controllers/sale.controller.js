const buildCreateSaleUseCase = require('../use_cases/sales/create-sale.usecase');
const buildUpdateSaleUseCase = require('../use_cases/sales/update-sale.usecase');
const buildGetSalesUseCase = require('../use_cases/sales/get-sales.usecase');
const buildGetSaleUseCase = require('../use_cases/sales/get-sale.usecase');
const buildDeleteSaleUseCase = require('../use_cases/sales/delete-sale.usecase');
const HttpResponse = require('../application/payloads/http-response');
const { saleMessages } = require('../application/messages');

module.exports = function buildSaleController(dependencies) {
  const createSaleUseCase = buildCreateSaleUseCase(dependencies);
  const updateSaleUseCase = buildUpdateSaleUseCase(dependencies);
  const getSalesUseCase = buildGetSalesUseCase(dependencies);
  const getSaleUseCase = buildGetSaleUseCase(dependencies);
  const deleteSaleUseCase = buildDeleteSaleUseCase(dependencies);

  async function createSale(request) {
    const sale = await createSaleUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.created({
      message: saleMessages.SALE_CREATED.FR,
      data: sale,
    });
  }

  async function updateSale(request) {
    const sale = await updateSaleUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: saleMessages.SALE_UPDATED.FR,
      data: sale,
    });
  }

  async function getSales(request) {
    const sales = await getSalesUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: sales,
    });
  }

  async function getSale(request) {
    const sale = await getSaleUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: sale,
    });
  }

  async function deleteSale(request) {
    const sale = await deleteSaleUseCase.execute(request.params);

    return HttpResponse.succeeded({
      message: saleMessages.SALE_DELETED(sale).FR,
      data: sale,
    });
  }

  return { createSale, updateSale, getSales, getSale, deleteSale };
};
