import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {RequiredRole} from './required-role';
import {KeycloakService} from 'keycloak-angular';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[requiredRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() requiredRole: RequiredRole;
  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    protected keycloakAngular: KeycloakService
  ) { }

  ngOnInit() {
    if (RequiredRole.hasRequiredRole(this.keycloakAngular, this.requiredRole)) {
      this.makeVisible();
    } else {
      this.makeHidden();
    }
  }

  private makeHidden() {
    this.isVisible = false;
    this.viewContainerRef.clear();
  }

  private makeVisible() {
    // If it is already visible (which can happen if
    // his roles changed) we do not need to add it a second time
    if (!this.isVisible) {
      // We update the `isVisible` property and add the
      // templateRef to the view using the
      // 'createEmbeddedView' method of the viewContainerRef
      this.isVisible = true;
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

}
