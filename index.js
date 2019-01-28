const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const models = require("./models");
const cors = require("cors");
const morgan = require("morgan");
const register = require("./server/routes");
const test = require("./server/testRoutes");
const passport = require("passport");
require("./passeport");
const port = 3001;

// const corsOption = {
//   origin: true,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   exposedHeaders: ["x-auth-token"]
// };
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use(morgan("dev"));
// app.use(passport.initialize());
// app.use(passport.session());
app.use("/api", register);
app.use("/test", passport.authenticate("jwt", { session: false }), test);

models.sequelize.sync().then(() => {
  app.listen(process.env.PORT || port, () =>
    console.log(`LISTENING ON PORT ${port}`)
  );
});

module.exports = app;
