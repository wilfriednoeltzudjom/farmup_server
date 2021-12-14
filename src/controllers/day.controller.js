const buildGetDaysUseCase = require('../use_cases/days/get-days.usecase');
const buildGetDayUseCase = require('../use_cases/days/get-day.usecase');
const buildUpdateDayUseCase = require('../use_cases/days/update-day.usecase');
const buildAddDayAlimentationUseCase = require('../use_cases/days/add-day-alimentation.usecase');
const buildUpdateDayAlimentationUseCase = require('../use_cases/days/update-day-alimentation.usecase');
const buildDeleteDayAlimentationUseCase = require('../use_cases/days/delete-day-alimentation.usecase');
const buildAddDayMedecineUseCase = require('../use_cases/days/add-day-medecine.usecase');
const buildUpdateDayMedecineUseCase = require('../use_cases/days/update-day-medecine.usecase');
const buildDeleteDayMedecineUseCase = require('../use_cases/days/delete-day-medecine.usecase');
const buildAddDayDeathUseCase = require('../use_cases/days/add-day-death.usecase');
const buildDeleteDayDeathUseCase = require('../use_cases/days/delete-day-death.usecase');

const HttpResponse = require('../application/payloads/http-response');
const { dayMessages } = require('../application/messages');

module.exports = function buildDayController(dependencies) {
  const getDaysUseCase = buildGetDaysUseCase(dependencies);
  const getDayUseCase = buildGetDayUseCase(dependencies);
  const updateDayUseCase = buildUpdateDayUseCase(dependencies);
  const addDayAlimentationUseCase = buildAddDayAlimentationUseCase(dependencies);
  const updateDayAlimentationUseCase = buildUpdateDayAlimentationUseCase(dependencies);
  const deleteDayAlimentationUseCase = buildDeleteDayAlimentationUseCase(dependencies);
  const addDayMedecineUseCase = buildAddDayMedecineUseCase(dependencies);
  const updateDayMedecineUseCase = buildUpdateDayMedecineUseCase(dependencies);
  const deleteDayMedecineUseCase = buildDeleteDayMedecineUseCase(dependencies);
  const addDayDeathUseCase = buildAddDayDeathUseCase(dependencies);
  const deleteDayDeathUseCase = buildDeleteDayDeathUseCase(dependencies);

  async function getDays(request) {
    const days = await getDaysUseCase.execute({ ...request.params });

    return HttpResponse.succeeded({
      data: days,
    });
  }

  async function getDay(request) {
    const day = await getDayUseCase.execute({ ...request.params });

    return HttpResponse.succeeded({
      data: day,
    });
  }

  async function updateDay(request) {
    const day = await updateDayUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      data: day,
    });
  }

  async function addDayAlimentation(request) {
    const day = await addDayAlimentationUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: dayMessages.ENTRY_CREATED.FR,
      data: day,
    });
  }

  async function updateDayAlimentation(request) {
    const day = await updateDayAlimentationUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: dayMessages.ENTRY_UPDATED.FR,
      data: day,
    });
  }

  async function deleteDayAlimentation(request) {
    const day = await deleteDayAlimentationUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: dayMessages.ENTRY_DELETED.FR,
      data: day,
    });
  }

  async function addDayMedecine(request) {
    const day = await addDayMedecineUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: dayMessages.ENTRY_CREATED.FR,
      data: day,
    });
  }

  async function updateDayMedecine(request) {
    const day = await updateDayMedecineUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: dayMessages.ENTRY_UPDATED.FR,
      data: day,
    });
  }

  async function deleteDayMedecine(request) {
    const day = await deleteDayMedecineUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: dayMessages.ENTRY_DELETED.FR,
      data: day,
    });
  }

  async function addDayDeath(request) {
    const day = await addDayDeathUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: dayMessages.ENTRY_CREATED.FR,
      data: day,
    });
  }

  async function deleteDayDeath(request) {
    const day = await deleteDayDeathUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: dayMessages.ENTRY_DELETED.FR,
      data: day,
    });
  }

  return { getDays, getDay, updateDay, addDayAlimentation, updateDayAlimentation, deleteDayAlimentation, addDayMedecine, updateDayMedecine, deleteDayMedecine, addDayDeath, deleteDayDeath };
};
