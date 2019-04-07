const express = require('express');
const router = express.Router();
// Load User model
const { ensureAuthenticated } = require('../config/auth');

const Controllers = require( '../controllers/users' );

// Login Page
router.get('/login', Controllers.LoginGet );

// Register Page
router.get('/register', Controllers.RegisterGet ); 

// Register
router.post('/register', Controllers.RegisterPost );

// Login
router.get( '/settings', ensureAuthenticated, Controllers.SettingsGet );

router.post( '/settings', ensureAuthenticated, Controllers.SettingsPost );

router.post( '/login', Controllers.LoginPost );

router.get( '/logout', Controllers.Logout );

module.exports = router;
