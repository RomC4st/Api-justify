const jwt = require("jsonwebtoken");
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const createToken = function(auth) {
  return jwt.sign(
    {
      id: auth.id
    },
    PRIVATE_KEY,
    {
      expiresIn: 60 * 120
    }
  );
};

module.exports = {
  generateToken: function(req, res, next) {
    req.token = createToken(req.auth);
    return next();
  },
  sendToken: function(req, res) {
    res.setHeader("x-auth-token", req.token);
    return res.status(200).send(JSON.stringify(req.user));
  }
};
