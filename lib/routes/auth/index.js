var express = require('express');
var router = express.Router();
var User = require('../../models/user.js');

const passport = require('passport');
const requireLogin = require('../../requireLogin')
const nodemailer = require('nodemailer')
var async = require('async');
var crypto = require('crypto'); // now part of node

var sendgrid_options = {
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
}

removeSaltHash = (user) => {
  let filteredUser = user
  filteredUser.salt = undefined
  filteredUser.hash = undefined
  return filteredUser
}

authSignup = (req, res) => {
  const { email, password } = req.body.data
  const newUser = new User({
    email: email
  });

  User.register(newUser, password, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      req.logIn(user, (err) => {
        const filteredUser = removeSaltHash(user)
        res.send(filteredUser);
      });
    }
  });
}

authLogin = (req, res) => {
  console.log(req)
  const filteredUser = removeSaltHash(req.user)
  res.send(filteredUser)
}

authInfo = (req, res) => {
  if (req.user) {

    var json = []

    try {
      User.findOne({ '_id': req.user._id }, function(err, myUser) {
        if (err) {
          console.log(err)
          res.send(404)
        } else {

          json = myUser.toObject()
          res.send(json)
        }
      })
    } catch (err) {
      res.send(err)
    }
    // res.status(200).send(req.user)
  } else {
    res.status(401).json({ message: "Unauthorized."});
  }
}

authIsAuthenticated = (req, res) => {
  res.status(200).send(req.isAuthenticated())
}

authChangePassword = (req, res) => {
  User.findByUsername(req.body.email).then(function(sanitizedUser){
      if (sanitizedUser){
          sanitizedUser.setPassword(req.body.password, function(){
              sanitizedUser.save();
              res.status(200).json({message: 'Password reset successfully'});
          });
      } else {
          res.status(500).json({message: 'This user does not exist'});
      }
  },function(err){
      console.error(err);
      res.send(err);
  })
}

authLogout = (req, res) => {
  req.logout();
  res.json('User logged out.');
}

// forgot / reset

authForgotPassword = (req, res) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          res.status(202).json({ "message": 'No account with that email address exists.'});
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpClient = nodemailer.createTransport(sendgrid_options);
      var mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Password Reset Request',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpClient.sendMail(mailOptions, function(err) {
        res.status(200).json({ "message": 'An e-mail has been sent to ' + user.email + ' with further instructions.'});
        done(err, 'done');
      });
    }
  ], function(err) {
    res.status(202).json({ "message": err });
  });
}

authResetPasswordVerifyToken = (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      res.status(202).json({ "message": 'Password reset token is invalid or has expired.'});
    } else {
      res.json({ "message": 'Password reset token is valid.'});
    }
  });
}

authResetPassword = (req, res) => {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          res.status(202).json({ "message": 'No account with that email address exists.'});
        }

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.setPassword(req.body.password, function(){
            user.save();
            res.status(200).json({message: 'Password updated successfully'});
            done(err, user);
        });
      });
    },
    function(user, done) {
      var smtpClient = nodemailer.createTransport(sendgrid_options);
      var mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
      };
      smtpClient.sendMail(mailOptions, function(err) {
        res.json({ "message": 'An e-mail has been sent to ' + user.username + ' with further instructions.'});
        done(err, 'done');
      });
    }
  ], function(err) {
    res.status(202).json({ "message": err });
  });
}

// standard signup/login/info/change_password/logout
router.post('/auth/signup', authSignup);
router.post('/auth/login', passport.authenticate('local'), authLogin);
router.get('/auth/info', requireLogin, authInfo);
router.get('/auth/authenticated', authIsAuthenticated)
router.post('/auth/change_password', requireLogin, authChangePassword);
router.get('/auth/logout', authLogout);

router.post('/auth/forgot', authForgotPassword);
router.get('/auth/reset/:token', authResetPasswordVerifyToken);
router.post('/auth/reset/:token', authResetPassword);

module.exports = router;
