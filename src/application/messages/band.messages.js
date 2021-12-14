module.exports = {
  BAND_CREATED: {
    EN: 'Your new band has been successfully created.',
    FR: 'Votre bande a bien été enregistrée.',
  },
  BAND_UPDATED: {
    EN: 'Your band has been successfully updated.',
    FR: 'Votre bande a bien été mise à jour.',
  },
  BAND_STARTED: {
    EN: 'Your band has been successfully started.',
    FR: 'Votre bande a bien été démarrée.',
  },
  BAND_CANCELLED({ code }) {
    return {
      EN: `Band <b>${code}</b> successfully cancelled.`,
      FR: `La bande <b>${code}</b> a bien été annulée.`,
    };
  },
  BAND_DELETED({ code }) {
    return {
      EN: `Band <b>${code}</b> successfully deleted.`,
      FR: `La bande <b>${code}</b> a bien été supprimée.`,
    };
  },
};
