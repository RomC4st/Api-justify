const express = require("express");
const jwt = require("jsonwebtoken");
const checkToken = require("../../jwt/checkToken");
const { generateToken, sendToken } = require("../../jwt/utils");
const bcrypt = require("bcrypt");
const models = require("../../models");
const passport = require("passport");
require("../../passeport");
const Router = express.Router();

/**
 * email regex
 * password regex
 * private key
 */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

Router.get("/", (req, res) => {
  res.status(200).json({ Message: " Welcome !!!" });
});
Router.get("/login", (req, res) => {
  res.status(200).json(` Wrong acount faceBook !!!`);
});
/**
 * api/register :create a count
 */
Router.post("/register", (req, res, next) => {
  console.log(req);

  const { body } = req;
  console.log("body ", body);

  const { username, email, password } = body;

  if (email == null || username == null || password == null) {
    return res.status(400).json({
      error: "missing parameters"
    });
  }

  if (username.length >= 13 || username.length <= 4) {
    return res.status(400).json({
      error: "wrong username (must be length 5 - 12)"
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      error: "email is not valid"
    });
  }

  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({
      error:
        "password invalid (must length 4 - 8 and include 1 number at least)"
    });
  }
  /**
   * check if the email user already exist
   */
  models.users
    .findOne({
      attributes: ["email"],
      where: {
        email: email
      }
    })
    .then(userFound => {
      if (!userFound) {
        bcrypt.hash(password, 5, (err, bcryptedPassword) => {
          const newUser = new models.users({
            email: email,
            name: username,
            passeword: bcryptedPassword
          });
          newUser.save().then(userFound => {
            const userData = {
              id: userFound.dataValues.id,
              name: userFound.dataValues.name
            };
            jwt.sign(
              {
                userData
              },
              PRIVATE_KEY,
              (err, token) => {
                if (err) {
                  console.log(err);
                }
                res.header("Access-Control-Expose-Headers", "x-access-token");
                res.set("x-access-token", token);
                res.status(200).send({
                  message: "user created",
                  connexion: true
                });
              }
            );
          });
        });
      } else {
        return res.status(409).json({
          error: "user already exist"
        });
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: "unable to verify user"
      });
    });
});

// Router.get(
//   "/auth/facebook",
//   passport.authenticate("facebook", { session: false })
// );
// Router.post(
//   "/auth/facebook",
//   passport.authenticate("facebook", { session: false }),
//   function(req, res, next) {
//     console.log("req ", req);

//     if (!req.user) {
//       return res.send(401, "User Not Authenticated");
//     }
//     req.auth = {
//       id: req.user.id
//     };

//     next();
//   },
//   generateToken,
//   sendToken
// );

// Router.post("/auth/facebook", (req, res) => {
//   console.log(req.body);
//   passport.authenticate("facebook", { session: false }, (err, user, info) => {

//    }
// });

// Router.get("/auth/facebook", passport.authenticate("facebook"));

// Router.get("/auth/facebook/callback", (req, res, next) => {
//   passport.authenticate("facebook", (err, user, info) => {
//     console.log(err, user, info);
//     if (err || !user) {
//       return res.status(400).send("Token Failed");
//     }
//     res.status(200).send("User conneted");
//   })(req, res, next);
// });
Router.get("/auth/facebook", passport.authenticate("facebook"));

Router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
/***
 * login to get a token
 */
Router.post("/login", (req, res, next) => {
  const { body } = req;
  const { email, password } = body;
  if (email == null || password == null) {
    return res.status(400).json({
      error: "missing parameters"
    });
  }
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log(err);
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : "Login failed",
        user: user
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }
      const userData = {
        id: user.id,
        name: user.name
      };
      jwt.sign(
        {
          userData
        },
        "privatekey",
        (err, token) => {
          if (err) {
            console.log(err);
          }
          res.header("Access-Control-Expose-Headers", "x-access-token");
          res.set("x-access-token", token);
          res.status(200).send({
            message: "user connected",
            connexion: true
          });
        }
      );
    });
  })(req, res, next);
});
/**
 * justify the text
 */
Router.post(
  "/justify",

  (req, res, next) => {
    const { body } = req;
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : "Token failed",
          connexion: user
        });
      }
      res.status(200).json({ user: user, connexion: true });
    })(req, res, next);
  }
);

/**
 *Check to make sure header is not undefined, if so, return Forbidden (403)
 */

const textJustification = (words, l) => {
  /**
   * 1. Split into lines, add between words to count
   * 2. Add spaces between words
   *	- Split extra spaces evenly between words
   *	- When spaces divide unevenly, split the extra and distribute again.
   *  - For lines with one word only, words are left justified, spaces on the right.
   *  - For the last line of text, words are left justified, spaces on the right.
   */
  var lines = [];
  var i = 0;
  lines[i] = [];
  for (var n in words) {
    if (lines[i].join(" ").length === 0 && words[n].length <= l) {
      lines[i].push(words[n]);
    } else if (lines[i].join(" ").length + words[n].length + 1 <= l) {
      lines[i].push(words[n]);
    } else {
      lines[++i] = [];
      lines[i].push(words[n]);
    }
  }

  for (var x in lines) {
    var line = lines[x].join(" ");
    var spaces = l - line.length;

    // last line
    if (x == lines.length - 1) {
      lines[x] = appendSpaces(line, spaces);
    }
    // just 1 word on the line
    else if (lines[x].length == 1) {
      var word = lines[x].join("");
      spaces = l - word.length;
      lines[x] = appendSpaces(word, spaces);
    } else {
      var w = lines[x];
      var gaps = w.length - 1;
      spaces = l - w.join("").length;
      var extraSpaces = spaces % gaps;
      var spacesPerGap = Math.floor(spaces / gaps);

      line = "";
      for (var j = 0; j < w.length; j++) {
        var addOneSpace = false;
        if (extraSpaces > 0) {
          addOneSpace = true;
          extraSpaces--;
        }
        var filler = spacesPerGap + (addOneSpace ? 1 : 0);
        if (j == w.length - 1) {
          line += w[j];
        } else {
          line += appendSpaces(w[j], filler);
        }
      }

      lines[x] = line;
    }
  }

  return lines;
};
const appendSpaces = (str, n) => {
  for (var x = 0; x < n; x++) {
    str += " ";
  }
  return str;
};

module.exports = Router;
