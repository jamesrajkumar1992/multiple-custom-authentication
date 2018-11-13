# Multiple Custom Authentications:

This is a Node.js application which support Multiple Custom Authentications using passport strategies. Supported authentication types are SAML 2.0, oAuth 2.0, openID connect and openID.So you can support multiple clients with different types of authentications in same application.


We have created an api called /authenticate which takes authentication type as path parameter. Based on the authentication type we instantiate the appropriate passport strategy. 

Each authentication type needs certain credentials to work. For example, SAML 2.0 needs entry point, call back url and issuer id which can be obtained from your client.

## IBM’s W3 SAML application:

To use SAML 2.0 of IBM, Please onboard an w3 application in the below link. Follow the instructions in the site to get the credentials required for our configuration.

https://w3.innovate.ibm.com/tools/sso/home.html


## Usage:

Just clone our repository. Add the appropriate credentials for each / needed authentication type in constants.js file & update manifest.yml. That’s it! you are ready. Deploy the application to Bluemix and test it.

## Testing:
Invoke the get api, 

example:
https://multiplecustomauth.mybluemix.net/authenticate/saml

We have used express-session which uses in memory session storage which is not meant for Production use. You can use any alternate module which uses db for session store.

On successful authentication you will be redirected to /success url where you can add your logic or present the desired page to the user.

On failed authentication you will be redirected to /failure where you can add your logic to relogin or present a different page to the user. 

Our manifest.yml is created for any cf application. Please modify this to update the host, name, memory , number of instances and services.

## Npm modules used:
express
body-parser
express-session
passport
passport-oauth2
passport-saml
passport-openid
passport-idaas-openidconnect

## Reference:
https://www.npmjs.com/package/passport-saml
https://www.npmjs.com/package/passport-oauth2
https://www.npmjs.com/package/passport-openid
https://www.npmjs.com/package/passport-idaas-openidconnect
