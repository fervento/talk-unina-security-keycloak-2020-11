import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {RequiredRole} from './required-role';


@Injectable({
  providedIn: 'root'
})
export class CanAuthenticationGuard extends KeycloakAuthGuard implements CanActivate {
  constructor(protected router: Router, protected keycloakAngular: KeycloakService) {
    super(router, keycloakAngular);
  }

  private getFullUrl(route: ActivatedRouteSnapshot): string {
    return window.location.origin + route.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join('/'))
      .join('/');
  }

  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.authenticated) {
        this.keycloakAngular.login({redirectUri: this.getFullUrl(route)})
          .catch(e => console.error(e));
        return reject(false);
      }

      const requiredRoles: RequiredRole[] = route.data.roles;

      /**
       * 'this.roles' contains all the roles of the user regardless of the scope mappings
       * so if the application defines role A and in the application is mapped role from another client,
       * let's say view-profile from account client, this.roles is ['A', 'view-profile']
       * and we lose the information about which client has associated a certain role.
       *
       * If we use the method 'hasResourceRole' we are able to discriminate also the client which
       * has certain role associated and we can ask
       * hasResourceRole('view-profile', 'account')?
       * If we don't specify the second parameter the clientId is used automatically
       *
       * We can use this.roles for a coarse grained check (e.g. has any roles?)
       * and the other method for a more fine grained and clash free check of the roles
       */

      if (!requiredRoles || requiredRoles.length === 0) {
        return resolve(true);
      } else {
        let hasAllRequiredRoles;

        if (!this.roles || this.roles.length === 0) {
          hasAllRequiredRoles = false;
        } else {
          hasAllRequiredRoles = requiredRoles.every(reqRole => RequiredRole.hasRequiredRole(this.keycloakAngular, reqRole));
        }

        resolve(hasAllRequiredRoles);
      }
    });
  }
}
