const express = require("express");
const router = express.Router();
const users = require("../data/users");
const xss = require("xss");

router.get("/", async (req, res) => {
  if (req.session.user) {
    res.redirect("/private");
  } else {
    res.render("users/login", {
      authenticated: false,
      title: "Log In",
    });
  }
});

router.get("/signup", async (req, res) => {
  if (req.session.user) {
    res.redirect("/private");
  } else {
    res.render("users/signup", {
      login_signup_page: true,
      authenticated: false,
      title: "Sign Up",
    });
  }
});

router.post("/signup", async (req, res) => {
  const username = xss(req.body.username.toLowerCase());
  const password = xss(req.body.password);
  const firstname = xss(req.body.firstname);
  const lastname = xss(req.body.lastname);
  const email = xss(req.body.email.toLowerCase());
  const age = parseInt(xss(req.body.age));
  try {
    if (!username) throw "You must provide a username for your account";
    if (!password) throw "You must provide a password for your account";
    if (!firstname || !lastname)
      throw "You must provide a name for your account";
    if (!email) throw "error 400,You must provide a email for your account";
    if (!age) throw "error 400,You must provide a age for your account";
    if (
      typeof username !== "string" ||
      username == undefined ||
      username.trim().length == 0
    )
      throw "You must provide a string username.";
    // if (!/^[a-z0-9]+$/i.test(username)) throw 'You must provide a  username only alphanumeric characters.'
    if (
      typeof password !== "string" ||
      password == undefined ||
      password.length < 6
    )
      throw "You must provide a string password with at least 6 characters.";
    if (password.indexOf(" ") != -1) throw "No space in password.";
    //
    if (
      typeof firstname !== "string" ||
      firstname == undefined ||
      firstname.trim().length == 0
    )
      throw "You must provide a non-blank string firstname.";
    if (
      typeof lastname !== "string" ||
      lastname == undefined ||
      lastname.trim().length == 0
    )
      throw "You must provide a non-blank string lastname.";
    if (
      typeof email !== "string" ||
      email == undefined ||
      email.trim().length == 0
    )
      throw "You must provide a valid email.";
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(email).toLowerCase()))
      throw "You must provide a valid email.";
    if (typeof age !== "number" || age <= 0)
      throw "You must provide a positive number in age.";
    //
    // console.log('create in routes');

    var result = await users.createUser(
      username,
      password,
      firstname,
      lastname,
      email,
      age
    );
    req.session.user = result;
    res.redirect("/private");
  } catch (e) {
    res.status(400).render("users/signup", { error: e });
  }
  // console.log(typeof result);
  // console.log(result);

  // if (result) {
  // res.redirect('/');
  // } else {
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
});

// Get login page
router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/private");
  } else {
    res.render("users/login", {
      // authenticated: false,
      login_signup_page: true,
      title: "Log In",
      // authenticated: false,
      // partial: 'login-script'
    });
  }
});

router.post("/login", async (req, res) => {
  const username = xss(req.body.username.toLowerCase());
  const password = xss(req.body.password);
  try {
    if (!username) throw "You must provide a username for your account";
    if (!password) throw "ou must provide a password for your account";
    if (
      typeof username !== "string" ||
      username == undefined ||
      username.trim().length == 0
    )
      throw "You must provide a string username with at least 4 characters.";
    // if (!/^[a-z0-9]+$/i.test(username)) throw 'You must provide a  username only alphanumeric characters.'
    if (
      typeof password !== "string" ||
      password == undefined ||
      password.length < 6
    )
      throw "You must provide a string password with at least 6 characters.";
    if (password.indexOf(" ") != -1) throw "No space in password.";

    var result = await users.checkUser(username, password);
  } catch (e) {
    res.status(400).render("users/login", {
      error: e,
      authenticated: false,
    });
  }

  if (typeof result != "undefined") {
    // req.session.user = { username: req.body.username };
    req.session.user = result;
    // console.log(req.session.user)
    res.redirect("/private");
  } else {
    // res.status(400).render('users/login', { error: "You did not provide a valid username or password" });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.render("users/logout");
});

module.exports = router;
