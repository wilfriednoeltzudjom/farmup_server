module.exports = {
  SALE_CREATED: {
    EN: 'Your new sale has been successfully created.',
    FR: 'Votre vente a bien été enregistrée.',
  },
  SALE_UPDATED: {
    EN: 'Your sale has been successfully updated.',
    FR: 'Votre vente a bien été mise à jour.',
  },
  SALE_DELETED({ code }) {
    return {
      EN: `Sale <b>${code}</b> successfully deleted.`,
      FR: `La vente <b>${code}</b> a bien été supprimée.`,
    };
  },
  INVALID_SALE_QUANTITY({ remainingChickensCount }) {
    return {
      EN: `Invalid quantity. Your remaining chickens count is <b>${remainingChickensCount}</b>.`,
      FR: `Quantité incorrecte. Votre nombre de sujets restants est de <b>${remainingChickensCount}</b>.`,
    };
  },
};
