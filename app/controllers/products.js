const { sep } = require( 'path' );
const Product = require('../models/products');
const { perPage } = require( '../config/keys' );

module.exports.NewProductGet = ( req, res ) => res.render( __dirname + sep + '..' + sep + 'views' + sep + 'products' + sep + 'newproduct', {title: 'Новый продукт'} );

module.exports.NewProductPost = ( req, res ) => {

    const { name, model, type } = req.body;

    let errors = [];

    if( !name || !model || !type  ) {
        errors.push( { msg: 'Пожалуйста введите все формы' } );
        return res.render( __dirname + sep + '..' + sep + 'views' + sep + 'products' + sep + 'newproduct', { errors :errors, title: 'Новый продукт', oldInput: req.oldInput }  )
    }

    const product = new Product({
        name,
        model,
        type,
    });

    product.save().then( prod => {

        req.flash(
            'success_msg',
            'Вы создали новый продукт'
        );
        res.redirect('/products/list/1');
    } );
}

module.exports.ListProduct = ( req, res, next ) => {

    let page = req.params.page || 1;
    
    Product.find({})
    .sort( {date: 'desc'} )
    .skip( ( perPage * page ) - perPage )
    .limit( perPage )
    .then( products => {

        Product.count().exec()
        .then( count => {

            res.render(  
                __dirname + sep + '..' + sep + 'views' + sep + 'products' + sep + 'listproducts', 
                {
                    products: products,
                    current: page,
                    pages: Math.ceil( count / perPage )
                }  
            );

        } ).catch( err => next( err ) );

    } ).catch( err=> next( err ) );
}

module.exports.EditProductGet = ( req, res ) => {
    
    Product.findById( req.params.id ).then( result => {

        req.session.userId = result._id;

        res.render(  
            __dirname + sep + '..' + sep + 'views' + sep + 'products' + sep + 'editproduct', 
            {
                product: result,
            }  
        );
    } ).catch( err => {
        res.status( 404 ).send( 'Page Not Found' );
    } );
}

module.exports.EditProductPut = ( req, res ) => {

    const { name, model, type } = req.body;

    let errors = [];

    if( !name ) errors.push( { msg: 'Пожалуйста, введите продукт компании' } );
    if( !model ) errors.push( { msg: 'Пожалуйста, введите модель продукта' } );
    if( !type ) errors.push( { msg: 'Пожалуйста, введите тип продукта' } );

    if( !name || !model || !type  ) {

        return res.render( __dirname + sep + '..' + sep + 'views' + sep + 'products' + sep + 'editproduct', { errors :errors, title: 'Редактировать продукт', oldInput: req.oldInput }  )
    }
     
    Product.findByIdAndUpdate( req.params.id, {name, model, type} )

    .then( result => {

        req.flash(
            'success_msg',
            "Вы редактируете продукт"
        );
        
        res.redirect('/products/list/1' );
    } ).catch( err => {

        res.status( 404 ).send( 'Page Not Found' );
    } );
}

module.exports.DeleteProduct = ( req, res ) => {

    if( req.session.userId != req.params.id ) return res.status( 400 );

    const { p_id } = req.body;
    
    if( !p_id ) return res.status( 400 );

    Product.where( { _id: p_id } ).findOneAndRemove()
    .then( result => {

        req.flash(
            'success_msg',
            "Вы удалили продукт"
        );
        res.redirect('/products/list/1' );
    } )
    .catch( err => {
        throw err;
    } );
}