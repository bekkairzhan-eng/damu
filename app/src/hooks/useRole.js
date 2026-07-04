import { useLocalStorage } from './useLocalStorage'

// Demo: current user has all roles by default so all panels are visible during presentation
// In production this comes from Keycloak token
const DEMO_ROLES = ['employee', 'hr', 'admin']

export function useRoles() {
  const [roles] = useLocalStorage('auth:roles', DEMO_ROLES)
  return roles ?? []
}

export function useHasRole(role) {
  const roles = useRoles()
  return roles.includes(role)
}
