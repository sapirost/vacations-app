var express = require('express');
var router = express.Router();
var usermodule = require('../modules/users.module');

router.post('/signin', async (req, res, next) => {
  let results = await usermodule.usernameExist(req.body.username.value);
  if (results.length > 0) {
    res.json ({ add: false });
  } 
  else {
    await usermodule.signin(req.body.firstname.value, req.body.lastname.value, req.body.username.value, req.body.password.value);
    let currentUser =  req.body.username.value;
    req.session.username = currentUser;
    res.json({
      logged: true,
      username: req.body.username.value,
      access:false
    });
  }
});

router.post('/login', async (req, res, next) => {
  let results = await usermodule.login(req.body.username.value, req.body.password.value);
  if (results.length > 0) {
    let currentUser = results[0].username;
    req.session.username = currentUser;
    let userObj = {logged: true, username: currentUser, access:false};
    
    if(results[0].access == 1) {
      userObj = {logged: true, username: currentUser, access:true};
      req.session.access = 1;
    }
    else
      req.session.access = 0;
    res.json({user: userObj});
  } 
  else {
    res.json ({ logged: false });
  }
});

router.get('/checksession', (req, res, next) => {
  if (req.session.username) {
    res.json({
      logged: true,
      username: req.session.username,
      access: req.session.access
    });
  } 
  else {
    res.json ({ logged: false });
  }
});

router.get('/getfavorites', async (req, res, next) => {
  try {
    let results = await usermodule.findFavoritesArray(req.session.username);
    let newResults = await JSON.parse(results[0].favoriteVacations); 
    res.json({data:newResults}); 
  }
  catch(err) { res.json(err) };     
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
      if(err) {
        res.json(err)
      } else {
        return res.redirect('/');
      }
    });
});

module.exports = router;