const buildSignInUseCase = require('../use_cases/auth/sign-in.usecase');
const buildSignUpUseCase = require('../use_cases/auth/sign-up.usecase');
const buildSignOutUseCase = require('../use_cases/auth/sign-out.usecase');
const buildGetProfileUseCase = require('../use_cases/auth/get-profile.usecase');
const HttpResponse = require('../application/payloads/http-response');
const { authMessages } = require('../application/messages');

module.exports = function buildAuthController(dependencies) {
  const signInUseCase = buildSignInUseCase(dependencies);
  const signUpUseCase = buildSignUpUseCase(dependencies);
  const signOutUseCase = buildSignOutUseCase(dependencies);
  const getProfileUseCase = buildGetProfileUseCase(dependencies);

  async function signIn(request) {
    const response = await signInUseCase.execute(request.body);

    return HttpResponse.succeeded({
      data: response,
      message: authMessages.SIGNED_IN.EN,
    });
  }

  async function signUp(request) {
    const response = await signUpUseCase.execute({ ...request.query, ...request.body });

    return HttpResponse.created({
      data: response,
      message: authMessages.SIGNED_UP.EN,
    });
  }

  async function signOut(request) {
    const response = await signOutUseCase.execute(request.user);

    return HttpResponse.succeeded({
      data: response,
      message: authMessages.SIGNED_OUT.EN,
    });
  }

  async function getProfile(request) {
    const response = await getProfileUseCase.execute(request.user);

    return HttpResponse.succeeded({
      data: response,
    });
  }

  return { signIn, signUp, signOut, getProfile };
};
