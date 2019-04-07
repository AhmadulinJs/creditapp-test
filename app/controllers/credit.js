const { sep } = require( 'path' );
const Client = require( '../models/clients' );
const { perPage } = require( '../config/keys' );
const Product = require( '../models/products' );
const Credit = require( '../models/credits' );
const Payments = require( '../models/payments' );
const moment = require( 'moment' );
moment.locale('ru');

module.exports.NewCreditGet = ( req, res ) => {

    Product.find()
    .sort( {date: 'desc'} )
    .then( products => {
       Client.find()
       .then( clients => {
        res.render( 
                __dirname + sep + '..' + sep + 'views' + sep + 'credits' + sep + 'newcredit',
                {
                    title: 'Новый Кредит',
                    clients: clients,
                    products: products
                } 
            );
       } );
    } );
}

module.exports.NewCreditPost = ( req, res ) => {


    const { client, product, price, amount, lifetime, monthly_payment, currency, date_of_payment, credit_date } = req.body;

    // let errors = [];

    // if( !client ) errors.push( { msg: 'Пожалуйста, выберите клиент' } );
    // if( !product ) errors.push( { msg: 'Пожалуйста, выберите продукт' } );
    // if( !price ) errors.push( { msg: 'Пожалуйста, введите цену продукта' } );
    // if( !amount ) errors.push( { msg: 'Пожалуйста, введите начальную сумму' } );
    // if( !lifetime ) errors.push( { msg: 'Пожалуйста, введите срок кредита' } );
    // if( !monthly_payment ) errors.push( { msg: 'Пожалуйста, введите ежемесячный платеж' } );
    // if( !currency ) errors.push( { msg: 'Пожалуйста, выберите валюту' } );
    // if( !date_of_payment ) errors.push( { msg: 'Пожалуйста, выберите валюту' } );

    if( !client || !product || !price || !amount || !lifetime || !monthly_payment|| !currency || !date_of_payment || !credit_date ){

        req.flash(
            'error_msg',
            'Пожалуйста введите все формы'
        );
        res.redirect('/credits/new', );

        return;
    }
        // return res.render( __dirname + sep + '..' + sep + 'views' + sep + 'credits' + sep + 'newcredit', { errors :errors, title: 'Новый Кредит', oldInput: req.oldInput }  );

    const credit = new Credit( {
        client,
        product,
        price,
        amount,
        lifetime,
        remaining_month: lifetime,
        monthly: monthly_payment,
        currency,
        date_of_payment,
        credit_date
    } );

    let curr_date = credit_date.split( "-" );
    let cur_d;
    let cur_year = curr_date[0];

    for( let i = 0; i < lifetime; ++i ){

        cur_d = i + parseInt( curr_date[1] ) + 1;

        if( ( i + parseInt( curr_date[1] ) + 1 ) > 12 ){
            cur_year = parseInt( curr_date[0] ) + 1
            cur_d = ( i+ parseInt( curr_date[1] ) + 1 ) - 12;
        }

        let payment = new Payments( {
            credit_id: credit._id,
            monthly_debt: monthly_payment,
            date: `${parseInt( cur_year )}-${cur_d}-${date_of_payment}`
        } );
        payment.year = parseInt( cur_year );
        payment.month = parseInt( cur_d );
        payment.day = parseInt( date_of_payment );

        credit.payments.push( payment._id );

        payment.save().then( re => {

        } )
        .catch( err => {
            throw err;
        } );
    }
     credit.save().then( result => {

        req.flash(
            'success_msg',
            'Вы создали новый кредит для клиента'
        )
        res.redirect('/credits/list/1');
    } )
    .catch( err => {
        throw err;
    } );
    
}

module.exports.ListCreditsGet = ( req, res, next ) => {

    let page = req.params.page || 1;

    Credit.find({})
    .sort( { date: 'desc' } )
    .skip( ( perPage * page ) - perPage )
    .limit( perPage )
    .exec()
    .then( credits => {

        Credit.count().exec()
        .then( count => {
            res.render(  
                __dirname + sep + '..' + sep + 'views' + sep + 'credits' + sep + 'listcredits', 
                {   
                    
                    credits: credits,
                    current: page,
                    pages: Math.ceil( count / perPage ),
                    moment: moment
                }  
            );

        } ).catch( err => next( err ) );

    } ).catch( err=> next( err ) );
}

module.exports.More = ( req, res ) => {

    // console.log( req.params );
}

