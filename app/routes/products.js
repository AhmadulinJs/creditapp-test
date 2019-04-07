const express = require('express');
const router = express.Router();

const Controller = require( '../controllers/products' );
router.get( '/new', Controller.NewProductGet );

router.post( '/new', Controller.NewProductPost );

router.get( '/list/:page' , Controller.ListProduct );

router.get( '/edit/:id', Controller.EditProductGet );

router.put( '/edit/:id', Controller.EditProductPut );

router.delete( '/delete/:id', Controller.DeleteProduct );

module.exports = router;