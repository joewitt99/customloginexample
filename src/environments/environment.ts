export const environment = {
  production: false,
  
  okta: {
    url: 'https://login.mywittslab.com',
    issuer: 'https://login.mywittslab.com/oauth2/default',
    redirectUri: 'https://OktaCustomLogin-joewitt99762476.codeanyapp.com/implicit/callback',
    clientId: '0oafiil6pxePi7ecP0h7'
  },
// requestContext is used to redirect the a user after IDP authentication.  
  requestContext: 'https://OktaCustomLogin-joewitt99762476.codeanyapp.com/protected'
};