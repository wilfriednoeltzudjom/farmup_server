const cron = require('node-cron');

const CronJob = require('../interface');

module.exports = class NodeCronJob extends CronJob {
  schedule(expression, callback, options = {}) {
    cron.schedule(expression, callback, { scheduled: true, ...options });
  }
};
