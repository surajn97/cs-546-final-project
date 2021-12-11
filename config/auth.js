module.exports = {
  ensureAuthenticated: (req, res, next) => {
    console.info("inside ensure" + req.session.returnTo);
    // console.info("inside ensure user " + req.user.id);
    if (req.session.user) {
      delete req.session.returnTo;
      return next();
    }
    req.session.returnTo = req.originalUrl;
    console.log("RETURN URL=" + req.originalUrl);
    res.redirect("/users/login");
  },
};
