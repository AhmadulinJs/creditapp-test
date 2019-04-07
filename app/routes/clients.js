const express = require('express');
const router = express.Router();
const Controller = require( '../controllers/clients' );
const upload = require( '../lib/file_upload' );

router.get( '/new', Controller.NewClientGet );

router.post( '/new', upload.array( 'file', 8 ), Controller.NewClientPost );

router.get( '/monthlydeptors/:page', Controller.Monthly_Deptor_clients );

router.get( '/list/:page', Controller.ListClients )

router.get( '/profile/:id', Controller.ClientPage );

router.put( '/edit/:id', Controller.EditClientProfile );

router.post( '/payment/:id', Controller.AddPayment );

router.get( '/debtors/today/:id', Controller.TodayDeptors );

router.delete( '/profile/delete/:id/:img', Controller.DeleteImages );

module.exports = router;