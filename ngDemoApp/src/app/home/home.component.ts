import {Component, OnInit} from '@angular/core';
import {KeycloakProfile} from 'keycloak-js';
import {HttpClient} from '@angular/common/http';
import {KeycloakService} from 'keycloak-angular';
import { RequiredRole } from 'src/app/authorization/required-role';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userDetails: KeycloakProfile;
  userRoles: string[];

  jwtToken: string;
  jwtTokenParsed: string;

  viewProfileRequiredRole: RequiredRole = {role: 'view-profile', allowAnyClientRole: true};

  constructor(private keycloakService: KeycloakService, private http: HttpClient) { }


  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();

      this.jwtToken = this.keycloakService.getKeycloakInstance().token;
      this.jwtTokenParsed = JSON.stringify(this.keycloakService.getKeycloakInstance().tokenParsed, null, 2);
      // this.uerGroups =  this.keycloakService.getKeycloakInstance().tokenParsed['groups'];
      this.userRoles = await this.keycloakService.getUserRoles(true);
    }
  }

  async doLogout() {
    await this.keycloakService.logout();
  }

  simulateHttpReq() {
    this.http.get('/auth/realms/' + this.keycloakService.getKeycloakInstance().realm + '/protocol/openid-connect/userinfo').subscribe(
      (data) => console.log('Received Data', data)
    );
  }

  simulateHttpReq2() {
    this.http.get('/assets/test-auth.json').subscribe(
      (data) => console.log('Received Data', data)
    );
  }

  simulateHttpReqWoToken() {
    this.http.get('/assets/test.json').subscribe(
      (data) => console.log('Received Data', data)
    );
  }


}
