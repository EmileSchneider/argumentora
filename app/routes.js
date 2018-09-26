// app/routes.js
var Argument = require ('./models/argument.js')
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:0MwdL31!@ds117362.mlab.com:17362/argumentora";
mongoose.connect(url)
var db = mongoose.connection

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
      db.collection('arguments').find({}).toArray(function(err, docs){
        res.render('index.ejs', { docs : docs })
      })
    });
        /*
        arguments.forEach(function(r){
          console.log(r);
        })
        */
         // load the index.ejs file

    // =============
    // Argumentation
    // =============
    app.get('/argument', isLoggedIn, function(req, res){
      db.collection('arguments').find(
        { author :
          { email : 'admin'},
        }
      ).toArray(function(err, docs){
        res.render('write_argument.ejs', {
          user : req.user,
          args : docs
        });
      })


    })

    app.post('/argument/list', isLoggedIn, function(req, res){
      Argument.find({title : req.body.title}, function(err, docs){
        console.log(docs);
        res.send({ docs : docs})
      })
    })

    app.post('/argument', function(req, res){
      var arg = new Argument({ author : {email : req.user.local.email }, title: req.body.title, argument : req.body.argument})
      if(Argument.find({title : req.body.title}).length === 0) {
        //check if there is no argument with the same title
        Argument.findOneAndUpdate({title : req.body.title}, {$set: {argument : req.body.argument}}, function(err, docs){
        })
      } else {
        console.log('/////');
        arg.save()
      }
      res.redirect('/argument')

    })
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
