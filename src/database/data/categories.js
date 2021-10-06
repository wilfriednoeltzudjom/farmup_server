const alimentationCategories = {
  EN: ['Food', 'Water'],
  FR: ['Aliment', 'Eau'],
};

const unitsOfMeasure = {
  EN: ['Kilogram', 'Bottle', 'Liter', 'Bag', 'Unit'],
  FR: ['Kilogramme', 'Litre', 'Sac', 'Boite', 'Unité'],
};

const prophylaxisRecordAdministrationModes = {
  EN: ['Sprout soaking', 'Water'],
  FR: ['Trempage de bec', 'Eau'],
};

const prophylaxisRecordCategories = {
  EN: ['Vaccine', 'Dewormer', 'Anticoccidial', 'Anti stress', 'Vitamin', 'Antibiotic'],
  FR: ['Vaccin', 'Vermifuge', 'Anticoccidien', 'Anti-stress', 'Vitamine', 'Antibiotique'],
};

const expenseCategories = {
  EN: ['Chicks', 'Prophylaxis', 'Alimentation', 'Equipment', 'Heating', 'Transport', 'Building', 'Salary'],
  FR: ['Sujets', 'Prophylaxie', 'Alimentation', 'Equipement', 'Chauffage', 'Transport', 'Bâtiment', 'Salaire'],
};

const customerCategories = {
  EN: ['Individual', 'Restaurant', 'Hotel', 'Reseller'],
  FR: ['Personne physique', 'Restaurant', 'Hôtel', 'Grossiste'],
};

const observationCategories = {
  EN: ['Chickens behaviour', 'Litter state'],
  FR: ['Comportement des sujets', 'État de la litière'],
};

const operationCategories = {
  EN: ['Building desynfection', 'Equipment maintenance', 'Builing maintenance'],
  FR: ['Désinfection du bâtiment', 'Entretien des équipements', 'Travaux sur le bâtiment'],
};

module.exports = {
  alimentationCategories,
  unitsOfMeasure,
  prophylaxisRecordAdministrationModes,
  prophylaxisRecordCategories,
  expenseCategories,
  customerCategories,
  observationCategories,
  operationCategories,
};
