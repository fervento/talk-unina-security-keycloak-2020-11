import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { HomeComponent } from './home/home.component';
import { CanAuthenticationGuard } from './authorization/can-authentication-guard.guard';
import { RequiredRole } from './authorization/required-role';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/public',
    pathMatch: 'full'
  },
  {
    path: 'public',
    component: PublicComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [CanAuthenticationGuard],
    data: {
      roles: [
        {client: 'ngDemoApp', role: 'test-role'},
        {client: 'account', role: 'view-profile'},
      ] as RequiredRole[]
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
