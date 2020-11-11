import {KeycloakService} from 'keycloak-angular';

export class RequiredRole {
  /**
   * Client id to which the role is associated, it can be undefined.
   * If so, the current clientId is used.
   */
  client?: string;

  /** The role required */
  role: string;

  /** Set to true if the role can be associated to any client */
  allowAnyClientRole?: boolean;

  static hasRequiredRole(kc: KeycloakService, reqRole: RequiredRole) {
    if (!reqRole.allowAnyClientRole) {
      return kc.isUserInRole(reqRole.role, reqRole.client);
    } else {
      return kc.getUserRoles(true).indexOf(reqRole.role) > -1;
    }
  }
}
