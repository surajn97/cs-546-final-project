const express = require('express');
const router = express.Router();
// const reviews = require('../data/reviews');


router.get('/', async (req, res) => {
  if (req.session.user) {
    const userData = req.session.user;
    console.log("userData")
    console.log(userData)
    console.log("userData")


    res.render('users/private', {
      username: req.session.user.username,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      age: userData.age



    });
  } else {
    res.redirect('/login');

  }


});

module.exports = router;
