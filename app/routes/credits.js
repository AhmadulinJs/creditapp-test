const express = require('express');
const router = express.Router();
const Controller = require( '../controllers/credit' );

router.get( '/new', Controller.NewCreditGet );

router.post( '/new', Controller.NewCreditPost );

router.get( '/list/:page', Controller.ListCreditsGet );

router.get( '/more/:id', Controller.More );


module.exports = router;