const { getBands, getDays } = require('../src/application/helpers/migration.helper');
const { DATABASE_COLLECTIONS } = require('../src/database/enums');
const { dateUtils } = require('../src/infrastructure');

module.exports = {
  async up(db) {
    await applyUpMigration(db);
  },

  async down() {},
};

async function applyUpMigration(db) {
  const bands = await getBands(db);

  await Promise.all(
    bands.map(async (band) => {
      const days = await getDays(db, { band: band._id });
      let lastValidDayIndex = -1;
      for (let i = 0; i < days.length - 1; i++) {
        if (dateUtils.isAfter({ dateAfter: days[i].date, dateBefore: days[i + 1].date })) {
          lastValidDayIndex = i;
        }
      }
      if (lastValidDayIndex === -1) return;

      const selectedDays = days.slice(lastValidDayIndex + 1);
      await Promise.all(
        selectedDays.map(async (day, index) => {
          return db.collection(DATABASE_COLLECTIONS.DAYS).updateOne(
            { _id: day._id },
            {
              $set: { date: dateUtils.add({ date: days[lastValidDayIndex].date, amount: index + 1 }) },
            }
          );
        })
      );
    })
  );
}
