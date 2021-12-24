module.exports = {
  CUSTOMER_PHONE_ALREADY_TAKEN: {
    FR: 'Un client existe déjà avec ce numéro de téléphone.',
    EN: 'A customer already exists with this phone number.',
  },
  CUSTOMER_EMAIL_ALREADY_TAKEN: {
    FR: 'Un client existe déjà avec cette adresse email.',
    EN: 'A customer already exists with this email address.',
  },
  CUSTOMER_CREATED: {
    EN: 'Your new customer has been successfully created.',
    FR: 'Votre client a bien été enregistré.',
  },
  CUSTOMER_UPDATED: {
    EN: 'Your customer has been successfully updated.',
    FR: 'Votre client a bien été mis à jour.',
  },
  CUSTOMER_DELETED({ code }) {
    return {
      EN: `Supplier <b>${code}</b> successfully deleted.`,
      FR: `Le client <b>${code}</b> a bien été supprimé.`,
    };
  },
  CUSTOMER_NON_DELETABLE: {
    EN: 'Supplier can not be deleted.',
    FR: 'Ce client ne peut pas être supprimé.',
  },
};
