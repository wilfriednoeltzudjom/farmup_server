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
  BAND_ENDED({ code }) {
    return {
      EN: `Band <b>${code}</b> successfully marked as ended.`,
      FR: `La bande <b>${code}</b> a bien été terminée.`,
    };
  },
  BAND_NON_FINISHABLE: {
    EN: 'You need to empty your chickens stock before doing this action.',
    FR: 'Vous devez vider votre stock de sujets pour effectuer cette action.',
  },
  BAND_NON_EDITABLE: {
    EN: 'You can no longer edit this band.',
    FR: 'Cette bande ne peut pas être mise à jour.',
  },
};
