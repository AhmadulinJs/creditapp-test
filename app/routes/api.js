const express = require('express');
const router = express.Router();
const Controller = require( '../controllers/api' );
const upload = require( '../lib/file_upload' );


router.post( '/profile/updateimg/:id', upload.array( 'files', 8 ), Controller.UpdateImage ); 
// 

router.post( '/monthlydebtpayment/:credit', Controller.monthly_debt_update );


router.post( '/search', Controller.Search );

module.exports = router;