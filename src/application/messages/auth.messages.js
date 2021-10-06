module.exports = {
  SIGNED_IN: {
    EN: 'You have been successfully signed in.',
    FR: 'Vous avez bien été connecté.',
  },
  SIGNED_UP: {
    EN: 'Your account have been successfully created.',
    FR: 'Votre compte a bien été créé.',
  },
  SIGNED_OUT: {
    EN: 'You have been successfully logged out.',
    FR: 'Vous avez bien été déconnecté.',
  },
  INCORRECT_PASSWORD: {
    EN: 'Incorrect password.',
    FR: 'Mot de passe incorrect.',
  },
  EMAIL_NOT_FOUND({ email }) {
    return {
      EN: `Email ${email} not found.`,
      FR: `L'adresse email ${email} n'est pas enregistrée`,
    };
  },
};
