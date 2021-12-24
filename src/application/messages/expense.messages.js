module.exports = {
  EXPENSE_CREATED: {
    EN: 'Your new expense has been successfully created.',
    FR: 'Votre dépense a bien été enregistrée.',
  },
  EXPENSE_UPDATED: {
    EN: 'Your expense has been successfully updated.',
    FR: 'Votre dépense a bien été mise à jour.',
  },
  EXPENSE_DELETED({ code }) {
    return {
      EN: `Expense <b>${code}</b> successfully deleted.`,
      FR: `La dépense <b>${code}</b> a bien été supprimée.`,
    };
  },
};
