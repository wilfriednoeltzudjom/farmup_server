const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const createBandUseCase = require('../../../src/use_cases/bands/create-band.usecase')(dependencies);
const getDaysUseCase = require('../../../src/use_cases/days/get-days.usecase')(dependencies);
const { ProphylaxisFactory, FarmFactory } = require('../../../src/database/factories');
const { BadRequestError, ResourceNotFoundError } = require('../../../src/application/helpers/errors');
const { BAND_STATUSES } = require('../../../src/database/enums');

describe('UseCase - Bands - Create band', () => {
  const { dateUtils } = dependencies;

  beforeEach(async function () {
    this.farm = await FarmFactory.createFarm();
    this.bandFormData = {
      chickensStartCount: 10,
      chickensStartAge: 17,
    };
  });

  it('should fail without the chickens start count', async function () {
    delete this.bandFormData.chickensStartCount;

    await expect(createBandUseCase.execute({ farmId: this.farm.id, ...this.bandFormData })).to.be.eventually.rejectedWith(BadRequestError, /chickensStartCount/);
  });

  it('should fail without the chickens start age', async function () {
    delete this.bandFormData.chickensStartAge;

    await expect(createBandUseCase.execute({ farmId: this.farm.id, ...this.bandFormData })).to.be.eventually.rejectedWith(BadRequestError, /chickensStartAge/);
  });

  it('should fail if the starting date was provided but was after the current date', async function () {
    this.bandFormData.startedAt = dateUtils.add({ amount: 3 });

    await expect(createBandUseCase.execute({ farmId: this.farm.id, ...this.bandFormData })).to.be.eventually.rejectedWith(
      BadRequestError,
      'La date de démarrage doit être antérieure ou égale à la date du jour.'
    );
  });

  it('should fail if there is no farm related to the provided farmId', async function () {
    await expect(createBandUseCase.execute(this.bandFormData)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should create a new band, calculate the appropriate chickens current age and set a prophylaxis snapshot', async function () {
    await ProphylaxisFactory.createProphylaxis({ farm: this.farm, records: [{ chickensAge: 17 }, { chickensAge: 45 }] });
    this.bandFormData.startedAt = dateUtils.substract({ amount: 15 });

    const band = await expect(createBandUseCase.execute({ farmId: this.farm.id, ...this.bandFormData })).to.be.fulfilled;
    expect(band.chickensCurrentAge).to.eql(32);
    expect(band.status).to.eql(BAND_STATUSES.RUNNING);
    expect(band.prophylaxis).to.not.be.undefined;
  });

  it('should create a new band and create additional days if the 45th had already been reached', async function () {
    this.bandFormData.startedAt = dateUtils.substract({ amount: 45 - this.bandFormData.chickensStartAge + 20 });

    const band = await expect(createBandUseCase.execute({ farmId: this.farm.id, ...this.bandFormData })).to.be.fulfilled;
    expect(band.chickensCurrentAge).to.eql(65);

    const days = await expect(getDaysUseCase.execute({ bandId: band.id })).to.be.fulfilled;
    expect(days).to.have.lengthOf(65 - band.chickensStartAge + 1);
    expect(dateUtils.isEqual({ comparedDate: days[days.length - 1].date, date: dateUtils.add({ date: days[0].date, amount: days.length - 1 }) })).to.eql(true);
  });
});
