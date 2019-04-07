module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Пожалуйста, войдите, чтобы просмотреть этот ресурс');
    res.redirect('/users/login');
  }
};
