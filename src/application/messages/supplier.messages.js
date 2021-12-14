module.exports = {
  SUPPLIER_PHONE_ALREADY_TAKEN: {
    FR: 'Un fournisseur existe déjà avec ce numéro de téléphone.',
    EN: 'A supplier already exists with this phone number.',
  },
  SUPPLIER_EMAIL_ALREADY_TAKEN: {
    FR: 'Un fournisseur existe déjà avec cette adresse email.',
    EN: 'A supplier already exists with this email address.',
  },
  SUPPLIER_CREATED: {
    EN: 'Your new supplier has been successfully created.',
    FR: 'Votre fournisseur a bien été enregistré.',
  },
  SUPPLIER_UPDATED: {
    EN: 'Your supplier has been successfully updated.',
    FR: 'Votre fournisseur a bien été mis à jour.',
  },
  SUPPLIER_DELETED({ code }) {
    return {
      EN: `Supplier <b>${code}</b> successfully deleted.`,
      FR: `Le fournisseur <b>${code}</b> a bien été supprimé.`,
    };
  },
  SUPPLIER_NON_DELETABLE: {
    EN: 'Supplier can not be deleted.',
    FR: 'Ce fournisseur ne peut pas être supprimé.',
  },
};
