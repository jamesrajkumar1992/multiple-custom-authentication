const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cfenv = require('cfenv'),
  session = require('express-session');
app.use(bodyParser.json())
var sess = {
  secret: constants.session_secret,
  cookie: {}
}
app.use(session(sess))

const constants = require('./constants.js'),
  passport = require('passport'),
  OAuth2Strategy = require('passport-oauth2'),
  SamlStrategy = require('passport-saml').Strategy,
  OpenIDStrategy = require('passport-openid').Strategy,
  OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.get('/authenticate/:authenticationType', function (req, res, next) {
  switch (req.params.authenticationType) {

    case "openidconnect":

      var Strategy = new OpenIDConnectStrategy({
        authorizationURL: constants.authorizationURL_oidc,
        tokenURL: constants.tokenURL_oidc,
        clientID: constants.clientId_oidc,
        clientSecret: constants.clientSecret_oidc,
        callbackURL: constants.callbackURL_oidc,
        scope: 'email',
        response_type: 'code',
        skipUserProfile: true,
        issuer: constants.issuer_oidc
      },
        function (iss, sub, profile, accessToken, refreshToken, params, done) {
          process.nextTick(function () {
            done(null, profile);
          })
        });


      passport.use(Strategy);
      passport.authenticate('openidconnect', function (err, user, info) {
        if (err) {
          return next(err);
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.send(user.username);
        });
      })(req, res, next);
      break;

    case "oauth":

      var Strategy = new OAuth2Strategy({
        authorizationURL: constants.authorizationURL_oauth,
        tokenURL: constants.tokenURL_oauth,
        clientID: constants.clientId_oauth,
        clientSecret: constants.clientSecret_oauth,
        callbackURL: constants.callbackURL_oauth
      },
        function (accessToken, refreshToken, profile, cb, done) {
          process.nextTick(function () {
            done(null, profile);
          });
        })

      passport.use(Strategy);
      passport.authenticate('oauth2', function (err, user, info) {
        if (err) {
          return next(err);
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.send(user.username);
        });
      })(req, res, next);
      break

    case "saml":
      var strategy = {
        entryPoint: constants.entryPoint_saml,
        callbackUrl: constants.callbackURL_saml,
        issuer: constants.issuer_saml,
        disableRequestedAuthnContext: 'true'
      }

      var Strategy = new SamlStrategy(strategy,

        function (profile, done) {
          process.nextTick(function () {

            done(null, profile);
          });

        })

      passport.use(Strategy);
      passport.authenticate('saml', function (err, user, info) {
        if (err) {
          return next(err);
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.send(user.username);
        });
      })(req, res, next);

      break


    case "openid":
      var Strategy = new OpenIDStrategy({
        providerURL: constants.providerURL_openid,
        realm: constants.realm_openid,
        returnURL: constants.callbackURL_openid
      },
        function (accessToken, refreshToken, profile, cb, done) {
          process.nextTick(function () {
            done(null, profile);
          });
        })

      passport.use(Strategy);
      passport.authenticate('openid', function (err, user, info) {
        if (err) {
          return next(err);
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.send(user.username);
        });
      })(req, res, next);

      break

    default:
      res.send('failed');

  }

})

/**
 * callback for OAUTH
 */
app.get('/auth/oauth/callback', function (req, res, next) {
  passport.authenticate('oauth2', {
    successRedirect: '/success',
    failureRedirect: '/failure',
  })(req, res, next);
});

/**
 * callback for OpenID
 */
app.get('/auth/openid/callback', function (req, res, next) {
  passport.authenticate('openid', {
    successRedirect: '/success',
    failureRedirect: '/failure',
  })(req, res, next);
});

/**
 * callback for OpenID Connect (OIDC)
 */
app.get('/auth/oidc/callback', function (req, res, next) {
  passport.authenticate('openidconnect', {
    successRedirect: '/success',
    failureRedirect: '/failure',
  })(req, res, next);
});

/**
 * callback for SAML
 */
app.post('/auth/saml/callback', function (req, res, next) {
  passport.authenticate('saml', {
    successRedirect: '/success',
    failureRedirect: '/failure',
  })(req, res, next);
})

/**
 * callback success redirection
 */
app.get('/success', function (req, res) {
  res.send("success")
})

app.get('/failure', function (req, res) {
  res.send('failed');
});


var port = (process.env.PORT);
app.listen(port);

