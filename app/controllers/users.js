const { sep } = require( 'path' );
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports.LoginGet = ( req, res ) => res.render( __dirname + sep + '..' + sep + 'views' + sep + 'login', {title: 'login'});

// console.log( __dirname + sep + '..' +  sep  + 'auth' + sep + 'login' );

module.exports.RegisterGet = ( req, res ) => res.render( __dirname + sep + '..'+ sep + 'views'+ sep  + 'register' );

module.exports.RegisterPost = ( req, res ) => {
    
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if ( !name || !email || !password || !password2 ) {
  
      errors.push( { msg: 'Пожалуйста, введите все поля' } );
    }
  
    if ( password != password2 ) {
      errors.push( { msg: 'Пароли не совпадают' } );
    }
  
    if ( password.length < 6 ) {
      errors.push( { msg: 'Пароль должен быть не менее 6 символов' });
    }
  
    if ( errors.length > 0 ) {
      res.render( 'register', {
        errors,
        name,
        email,
        password,
        password2
      } );
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {

          errors.push({ msg: 'Адрес электронной почты уже существует' });
          
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'Вы зарегистрированы и можете войти'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      } );
    }
}

module.exports.LoginPost = ( req, res, next ) => {

    passport.authenticate( 'local', {

      successRedirect: '/dashboard',

      failureRedirect: '/users/login',

      failureFlash: true
    } )( req, res, next );

}
  
module.exports.Logout = ( req, res ) => {
    req.logout();
    req.flash('success_msg', 'Вы вышли из системы');
    res.redirect('/users/login');
} 
  
module.exports.SettingsGet = ( req, res ) => {

  res.render( __dirname + sep + '..' + sep + 'views' + sep + 'setting' );
}

module.exports.SettingsPost = ( req, res ) => {

  const { password, confirm_p } = req.body;

  if( password != confirm_p ){

    req.flash('error_msg', 'Пароль не совпадають ');
    res.redirect('/users/settings');
    return;
  }

  User.findById( req.session.passport.user ).then( user => {

      bcrypt.genSalt(10, (err, salt) => {

        bcrypt.hash( password, salt, (err, hash) => {

          if ( err ) throw err;

          user.password = hash;
          user
            .save()
            .then( u => {
              req.flash(
                'success_msg',
                'Вы зарегистрированы и можете войти'
              );
              res.redirect('/users/logout');
            })
            .catch(err => console.log(err));
      });
    });
  } );
}