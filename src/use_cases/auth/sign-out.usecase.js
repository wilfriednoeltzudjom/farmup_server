const { ResourceNotFoundError, BadRequestError } = require('../../application/helpers/errors');
const { SESSION_STATUSES } = require('../../database/enums');
const { Session } = require('../../database/models');

module.exports = function buildSignOutUseCase() {
  async function execute({ sessionId } = {}) {
    const session = await findSessionById(sessionId);
    ensureSessionIsRunning(session);
    session.status = SESSION_STATUSES.ENDED;
    session.endedAt = new Date();

    return session.save();
  }

  async function findSessionById(sessionId) {
    const session = await Session.findById(sessionId);
    if (!session) throw new ResourceNotFoundError(`No session found for id: ${sessionId}.`);

    return session;
  }

  function ensureSessionIsRunning(session) {
    if (session.status !== SESSION_STATUSES.RUNNING) {
      throw new BadRequestError('This session is already ended.');
    }
  }

  return { execute };
};
