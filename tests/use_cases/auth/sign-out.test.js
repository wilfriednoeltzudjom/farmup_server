const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const signOutUseCase = require('../../../src/use_cases/auth/sign-out.usecase')(dependencies);
const { SessionFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');
const { SESSION_STATUSES } = require('../../../src/database/enums');

describe('UseCase - Sign out', () => {
  it('should fail if there is no existing session related to the provided sessionId', async function () {
    const session = SessionFactory.generateSession({}, { _id: { skip: false } });

    await expect(signOutUseCase.execute({ sessionId: session.id })).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the session is already ended', async function () {
    const session = await SessionFactory.createSession({ status: SESSION_STATUSES.ENDED });

    await expect(signOutUseCase.execute({ sessionId: session.id })).to.be.eventually.rejectedWith(BadRequestError, 'This session is already ended.');
  });

  it('should succeed and set the running session as ended', async function () {
    const session = await SessionFactory.createSession({ status: SESSION_STATUSES.RUNNING });

    const updatedSession = await expect(signOutUseCase.execute({ sessionId: session.id })).to.be.fulfilled;
    expect(updatedSession.status).to.be.eql(SESSION_STATUSES.ENDED);
  });
});
