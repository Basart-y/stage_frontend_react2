function norm(value) {
  return String(value || '')
    .trim()
    .toLocaleLowerCase('fr-FR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, "'")
    // Les utilisateurs peuvent saisir « Bouches du Rhône », « Bouches-du-Rhône »
    // ou encore « 13 - Bouches-du-Rhône ». On neutralise la ponctuation pour
    // comparer les libellés de façon robuste.
    .replace(/[-–—_/.,;:()]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Correspondance des départements français vers leur région.
// Les noms et les codes sont acceptés pour rendre le contrôle de périmètre
// robuste aux valeurs saisies dans les formulaires et aux anciennes données.
const REGION_BY_DEPARTMENT = new Map();

function addRegion(region, departments) {
  for (const department of departments) REGION_BY_DEPARTMENT.set(norm(department), region);
}

addRegion('Auvergne-Rhône-Alpes', [
  '01','Ain','03','Allier','07','Ardèche','15','Cantal','26','Drôme','38','Isère','42','Loire','43','Haute-Loire','63','Puy-de-Dôme','69','Rhône','73','Savoie','74','Haute-Savoie',
]);
addRegion('Bourgogne-Franche-Comté', [
  "21","Côte-d'Or",'25','Doubs','39','Jura','58','Nièvre','70','Haute-Saône','71','Saône-et-Loire','89','Yonne','90','Territoire de Belfort',
]);
addRegion('Bretagne', ['22',"Côtes-d'Armor",'29','Finistère','35','Ille-et-Vilaine','56','Morbihan']);
addRegion('Centre-Val de Loire', ['18','Cher','28','Eure-et-Loir','36','Indre','37','Indre-et-Loire','41','Loir-et-Cher','45','Loiret']);
addRegion('Corse', ['2A','Corse-du-Sud','2B','Haute-Corse','20','Corse']);
addRegion('Grand Est', ['08','Ardennes','10','Aube','51','Marne','52','Haute-Marne','54','Meurthe-et-Moselle','55','Meuse','57','Moselle','67','Bas-Rhin','68','Haut-Rhin','88','Vosges']);
addRegion('Hauts-de-France', ['02','Aisne','59','Nord','60','Oise','62','Pas-de-Calais','80','Somme']);
addRegion('Île-de-France', ['75','Paris','77','Seine-et-Marne','78','Yvelines','91','Essonne','92','Hauts-de-Seine','93','Seine-Saint-Denis','94','Val-de-Marne','95',"Val-d'Oise"]);
addRegion('Normandie', ['14','Calvados','27','Eure','50','Manche','61','Orne','76','Seine-Maritime']);
addRegion('Nouvelle-Aquitaine', ['16','Charente','17','Charente-Maritime','19','Corrèze','23','Creuse','24','Dordogne','33','Gironde','40','Landes','47','Lot-et-Garonne','64','Pyrénées-Atlantiques','79','Deux-Sèvres','86','Vienne','87','Haute-Vienne']);
addRegion('Occitanie', ['09','Ariège','11','Aude','12','Aveyron','30','Gard','31','Haute-Garonne','32','Gers','34','Hérault','46','Lot','48','Lozère','65','Hautes-Pyrénées','66','Pyrénées-Orientales','81','Tarn','82','Tarn-et-Garonne']);
addRegion('Pays de la Loire', ['44','Loire-Atlantique','49','Maine-et-Loire','53','Mayenne','72','Sarthe','85','Vendée']);
addRegion("Provence-Alpes-Côte d'Azur", ['04','Alpes-de-Haute-Provence','05','Hautes-Alpes','06','Alpes-Maritimes','13','Bouches-du-Rhône','83','Var','84','Vaucluse']);
addRegion('Guadeloupe', ['971','Guadeloupe']);
addRegion('Martinique', ['972','Martinique']);
addRegion('Guyane', ['973','Guyane']);
addRegion('La Réunion', ['974','La Réunion','Réunion']);
addRegion('Mayotte', ['976','Mayotte']);

const KNOWN_REGIONS = new Set([...REGION_BY_DEPARTMENT.values()].map(norm));

const REGION_ALIASES = new Map([
  ['paca', "Provence-Alpes-Côte d'Azur"],
  ["provence alpes cote d azur", "Provence-Alpes-Côte d'Azur"],
]);

function canonicalRegion(value) {
  const normalized = norm(value);
  return REGION_ALIASES.get(normalized) || value;
}

export function regionForDepartment(department) {
  const normalized = norm(department);
  if (!normalized) return null;

  // Correspondance directe sur le code ou le nom du département.
  const direct = REGION_BY_DEPARTMENT.get(normalized);
  if (direct) return direct;

  // Accepte aussi des saisies comme « 13 Bouches du Rhône ».
  const withoutLeadingCode = normalized.replace(/^(?:0?[1-9]|[1-8]\d|9[0-5]|2a|2b|97[1-6])\s+/, '');
  return REGION_BY_DEPARTMENT.get(withoutLeadingCode) || null;
}

function resourceRegion(resource = {}) {
  const explicit = resource.region || resource.regionName || resource.profile?.region || resource.profile?.regionName;
  if (explicit) return explicit;
  const department = resource.departement || resource.department || resource.profile?.departement || resource.profile?.department;
  return regionForDepartment(department);
}

export function scopeAllows(scope, resource = {}) {
  if (!scope || scope.niveau === 'pays') return true;

  const level = norm(scope.niveau);
  const rawScopeValue = scope.valeur || scope.value || scope.region || scope.departement || scope.department || '';
  const scopeValue = norm(canonicalRegion(rawScopeValue));

  if (level === 'ville') {
    return norm(resource.ville || resource.city || resource.profile?.ville || resource.profile?.city) === scopeValue;
  }

  if (level === 'region' || level === 'regionale' || level === 'regional') {
    return norm(canonicalRegion(resourceRegion(resource))) === scopeValue;
  }

  if (level === 'departement') {
    const department = resource.departement || resource.department || resource.profile?.departement || resource.profile?.department;

    // Compatibilité avec les gestionnaires déjà enregistrés avant l'ajout du
    // niveau « région » : si la valeur d'un ancien périmètre départemental est
    // en réalité un nom de région, on l'interprète comme un périmètre régional.
    if (KNOWN_REGIONS.has(scopeValue)) return norm(resourceRegion(resource)) === scopeValue;

    return norm(department) === scopeValue;
  }

  // Compatibilité avec d'anciennes données : si le niveau est mal renseigné
  // mais que la valeur correspond clairement à une région connue, on applique
  // tout de même le contrôle régional au lieu de bloquer l'invitation.
  if (KNOWN_REGIONS.has(scopeValue) || REGION_ALIASES.has(norm(rawScopeValue))) {
    return norm(canonicalRegion(resourceRegion(resource))) === scopeValue;
  }

  return false;
}

export function assertScopeAllows(scope, resource) {
  if (!scopeAllows(scope, resource)) throw new Error('OUT_OF_SCOPE');
}
