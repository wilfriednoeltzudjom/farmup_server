const buildCreateBandUseCase = require('../use_cases/bands/create-band.usecase');
const buildUpdateBandUseCase = require('../use_cases/bands/update-band.usecase');
const buildStartBandUseCase = require('../use_cases/bands/start-band.usecase');
const buildCancelBandUseCase = require('../use_cases/bands/cancel-band.usecase');
const buildGetBandsUseCase = require('../use_cases/bands/get-bands.usecase');
const buildGetBandUseCase = require('../use_cases/bands/get-band.usecase');
const buildGetBandsAnalyticsUseCase = require('../use_cases/bands/get-bands-analytics.usecase');
const buildGetBandAnalyticsUseCase = require('../use_cases/bands/get-band-analytics.usecase');
const buildDeleteBandUseCase = require('../use_cases/bands/delete-band.usecase');
const buildEndBandUseCase = require('../use_cases/bands/end-band.usecase');
const HttpResponse = require('../application/payloads/http-response');
const { bandMessages } = require('../application/messages');

module.exports = function buildBandController(dependencies) {
  const createBandUseCase = buildCreateBandUseCase(dependencies);
  const updateBandUseCase = buildUpdateBandUseCase(dependencies);
  const startBandUseCase = buildStartBandUseCase(dependencies);
  const cancelBandUseCase = buildCancelBandUseCase(dependencies);
  const getBandsUseCase = buildGetBandsUseCase(dependencies);
  const getBandUseCase = buildGetBandUseCase(dependencies);
  const getBandsAnalyticsUseCase = buildGetBandsAnalyticsUseCase(dependencies);
  const getBandAnalyticsUseCase = buildGetBandAnalyticsUseCase(dependencies);
  const deleteBandUseCase = buildDeleteBandUseCase(dependencies);
  const endBandUseCase = buildEndBandUseCase(dependencies);

  async function createBand(request) {
    const band = await createBandUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.created({
      message: bandMessages.BAND_CREATED.FR,
      data: band,
    });
  }

  async function updateBand(request) {
    const band = await updateBandUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: bandMessages.BAND_UPDATED.FR,
      data: band,
    });
  }

  async function startBand(request) {
    const band = await startBandUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: bandMessages.BAND_STARTED.FR,
      data: band,
    });
  }

  async function cancelBand(request) {
    const band = await cancelBandUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: bandMessages.BAND_CANCELLED(band).FR,
      data: band,
    });
  }

  async function getBands(request) {
    const bands = await getBandsUseCase.execute({ ...request.params, ...request.query });

    return HttpResponse.succeeded({
      data: bands,
    });
  }

  async function getBand(request) {
    const band = await getBandUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: band,
    });
  }

  async function getBandsAnalytics(request) {
    const analytics = await getBandsAnalyticsUseCase.execute({ ...request.params, ...request.query });

    return HttpResponse.succeeded({
      data: analytics,
    });
  }

  async function getBandAnalytics(request) {
    const analytics = await getBandAnalyticsUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: analytics,
    });
  }

  async function deleteBand(request) {
    const band = await deleteBandUseCase.execute(request.params);

    return HttpResponse.succeeded({
      message: bandMessages.BAND_DELETED(band).FR,
      data: band,
    });
  }

  async function endBand(request) {
    const band = await endBandUseCase.execute(request.params);

    return HttpResponse.succeeded({
      message: bandMessages.BAND_ENDED(band).FR,
      data: band,
    });
  }

  return { createBand, updateBand, startBand, cancelBand, getBands, getBand, getBandsAnalytics, getBandAnalytics, deleteBand, endBand };
};
