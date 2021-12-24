module.exports = {
  ENTRY_CREATED: {
    EN: 'Your entry has been successfully saved.',
    FR: 'Votre entrée a bien été enregistrée.',
  },
  ENTRY_UPDATED: {
    EN: 'Your entry has been successfully updated.',
    FR: 'Votre entrée a bien été mise à jour.',
  },
  ENTRY_DELETED: {
    EN: 'Your entry has been successfully deleted.',
    FR: "L'entrée a bien été supprimée.",
  },
  INVALID_DEATHS_COUNT({ remainingChickensCount }) {
    return {
      EN: `Invalid lost count. Your remaining chickens count is <b>${remainingChickensCount}</b>.`,
      FR: `Nombre de pertes incorrect. Votre nombre de sujets restants est de <b>${remainingChickensCount}</b>.`,
    };
  },
};
