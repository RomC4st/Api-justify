const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const models = require("./models");
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const FacebookStrategy = require("passport-facebook").Strategy;
const configAuth = require("./auth");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, cb) => {
      models.users
        .findOne({ where: { email: email } })
        .then(userFound => {
          if (userFound) {
            bcrypt.compare(password, userFound.passeword, function(
              errBycrypt,
              resBycrypt
            ) {
              if (resBycrypt)
                return cb(null, userFound, {
                  message: "Logged In Successfully"
                });
              else
                return cb(null, false, {
                  message: "Incorrect password."
                });
            });
          } else return cb(null, false, { message: "Email password." });
        })
        .catch(err => cb(err));
    }
  )
);

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "privatekey"
    },
    function(jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return models.users
        .findById(jwtPayload.userData.id)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          console.log("err", err);

          return cb(err, { message: "Error token" });
        });
    }
  )
);

passport.use(
  "facebook",
  new FacebookStrategy(
    {
      // clientID: configAuth.faceBookAuth.clientID,
      // clientSecret: configAuth.faceBookAuth.clientSecret,
      // callbackURL: configAuth.faceBookAuth.callbackURL
      clientID: "1736117719822046",
      clientSecret: "09ae7dfd4e9578a209db3c1c9f16b474",
      callbackURL:"https://justify-text-api.herokuapp.com/api//auth/facebook/callback",
      profileFields: ["emails", "name", "displayName", "profileUrl"]
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("*********profile", profile);
      console.log("**********", accessToken);

      models.users
        .findOne({ where: { faceBookId: profile.id } })
        .then(userFound => {
          if (userFound) {
            console.log("user found");

            return done(null, userFound);
          } else {
            const newUser = new models.users({
              name: profile.displayName,
              faceBookId: profile.id
              //token: accessToken
            });
            newUser.save(err => {
              if (err) return done(err);
              else return done(null, newUser);
            });
          }
        });
    }
  )
);
