import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart} from '@angular/router';

import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';

import * as OktaAuth from '@okta/okta-auth-js';

import { environment as config } from './../../environments/environment';

@Component({
  selector: 'app-secure',
  template: `
    <!-- Container to inject the Sign-In Widget -->
    <div id="okta-signin-container"></div>
  `
})
export class LoginComponent {
  
  oktaAuth = new OktaAuth({
    url: config.okta.url,
    clientId: config.okta.clientId,
    issuer: config.okta.issuer,
    redirectUri: config.okta.redirectUri,
  });
  
  signIn;
  widget = new OktaSignIn({
    baseUrl: config.okta.url,
    features: {
      idpDiscovery: true
    },
    idpDiscovery: {
      requestContext: config.requestContext
    }
  });

  constructor(oktaAuth: OktaAuthService, router: Router) {
    this.signIn = oktaAuth;

    // Show the widget when prompted, otherwise remove it from the DOM.
    router.events.forEach(event => {
      if (event instanceof NavigationStart) {
        switch(event.url) {
          case '/login':
            break;
          case '/protected':
            break;
          default:
            this.widget.remove();
            break;
        }
      }
    });
  }

  ngOnInit() {
    this.widget.session.get((res) => {
      console.log(res.status);
      if(res.status === 'ACTIVE') {
        this.oktaAuth.token.getWithRedirect({
          responseType: ['id_token', 'token'],
          prompt: 'none'
        });
        return;
      } else if (res.status === 'INACTIVE') {
        console.log("display widget");
        this.widget.renderEl({
          el: '#okta-signin-container'},
          (res) => {
            if (res.status === 'SUCCESS') {
              this.signIn.loginRedirect('/', { sessionToken: res.session.token });
              // Hide the widget
              this.widget.hide();
            } else if (res.status === 'IDP_DISCOVERY') {
              console.log(res);
              res.idpDiscovery.redirectToIdp();
              return;
            }
          },
          (err) => {
            throw err;
          }
        );
      }
    });
  }
}