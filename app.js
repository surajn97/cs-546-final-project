const express = require("express");

const app = express();
const static = express.static(__dirname + "/public");
const path = require("path");
const configRoutes = require("./routes");
const exphandlebars = require("express-handlebars");
const session = require("express-session");
const port = process.env.PORT || 3000;
const { engine } = require("express-handlebars");
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");

app.use("/public", static);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/public", static);

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

let logger = (req, res, next) => {
  let isAuth = "Non-Authenticated User";
  if (req.session.user) {
    isAuth = "Authenticated User";
  }
  let datetime = new Date().toUTCString();
  let method = req.method;
  let url = req.originalUrl;
  let log = `[${datetime}]: ${method} ${url} (${isAuth}) `;
  console.log(log);
  next();
};
app.use(logger);

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:" + port);
});
