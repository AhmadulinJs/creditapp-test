const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


const Controllers = require( '../controllers/index' );
// Welcome Page
router.get('/', Controllers.Index );

router.get( '/',  )
// Dashboard
router.get('/dashboard', ensureAuthenticated, Controllers.Dashboard );



module.exports = router;
