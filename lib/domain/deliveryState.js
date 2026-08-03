export const ALLOWED_TRANSITIONS = {
  'Créée': ['En transit', 'Arrivé au point relais', 'Refusé', 'Retour demandé'],
  'En transit': ['Arrivé au point relais', 'Refusé', 'Retour demandé'],
  'Arrivé au point relais': ['Retiré', 'Retour demandé', 'Non récupéré'],
  'Retour demandé': ['Retourné'], 'Non récupéré': ['Retour demandé', 'Retourné'],
  'Refusé': ['Retour demandé', 'Retourné'], 'Retiré': [], 'Retourné': [],
};
