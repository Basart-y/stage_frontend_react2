function norm(value) {
  return String(value || '').trim().toLocaleLowerCase('fr-FR');
}

export function scopeAllows(scope, resource = {}) {
  if (!scope || scope.niveau === 'pays') return true;
  if (scope.niveau === 'departement') return norm(resource.departement || resource.profile?.departement) === norm(scope.valeur);
  if (scope.niveau === 'ville') return norm(resource.ville || resource.profile?.ville) === norm(scope.valeur);
  return false;
}

export function assertScopeAllows(scope, resource) {
  if (!scopeAllows(scope, resource)) throw new Error('OUT_OF_SCOPE');
}
