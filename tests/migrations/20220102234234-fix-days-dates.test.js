const mongoose = require('mongoose');

const migration = require('../../migrations/20220102234234-fix-days-dates');
const dependencies = require('../../src/infrastructure');
const { createBand, createDay, getBands, getDays } = require('../../src/application/helpers/migration.helper');
const { expect } = require('chai');

describe('Migration - fix days dates', () => {
  const { dateUtils } = dependencies;

  beforeEach(() => {
    this.db = mongoose.connection;
  });

  describe('migrate up', () => {
    it('should apply up migration on matching days', async () => {
      await createUpMigrationTestData(this.db);

      await migration.up(this.db);

      const bands = await getBands(this.db);
      expect(bands).to.have.lengthOf(2);
      await Promise.all(
        bands.map(async (band) => {
          const bandDaysMigrated = await haveBandDaysBeenProperlyMigrated(this.db, band);
          expect(bandDaysMigrated).to.eql(true);
        })
      );
    });

    async function createUpMigrationTestData(db) {
      const bandIds = (
        await Promise.all(
          Array(2)
            .fill()
            .map(() => createBand(db))
        )
      ).map(({ insertedId }) => insertedId);
      const dates = Array(10)
        .fill()
        .map((_, index) => dateUtils.add({ amount: index }));
      const lastDateAtPreviousMonth = dateUtils.substract({ date: dates[dates.length - 1], amount: 1, dateUnit: 'month' });
      dates.push(
        ...Array(5)
          .fill()
          .map((_, index) => dateUtils.add({ date: lastDateAtPreviousMonth, amount: index }))
      );
      await Promise.all(
        bandIds.flatMap((bandId) => {
          return dates.map((date, index) => createDay(db, { date, chickensAge: index + 1, band: bandId }));
        })
      );
    }

    async function haveBandDaysBeenProperlyMigrated(db, band) {
      const days = await getDays(db, { band: band._id });
      let bandDaysMigrated = true;
      for (let i = 0; i < days.length - 1; i++) {
        if (dateUtils.isAfter({ dateAfter: days[i].date, dateBefore: days[i + 1].date })) {
          bandDaysMigrated = false;
        }
      }

      return bandDaysMigrated;
    }
  });
});
