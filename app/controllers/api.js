const { sep } = require( 'path' );
const { perPage } = require( '../config/keys' );
const Client = require( '../models/clients' );
const Product = require( '../models/products' );
const Payment = require( '../models/payments' );
const Credit = require( '../models/credits' );
const moment = require( 'moment' );
moment.locale('ru');

module.exports.UpdateImage = ( req, res ) => {

    Client.findById( req.params.id ).then( client => {

        req.files.forEach( file => {

            client.files.push( file.filename );
        } );
        client.save().then( sucess => {

            Client.findById( req.params.id ).then( c => {

                res.status( 200 ).json( c );
            } )
            .catch( err => {
                throw err
            } );
        } )
        .catch( err => {
            throw err
        } );
    } )
    .catch( err => {
        throw err
    } );
}

module.exports.Search = ( req, res ) => {

    const { searchBy, data } = req.body;

    // console.log( data )

    if( /\w+/.test( data ) ){

        if( searchBy == `client` ){
            const regex = /[A-Za-z0-9_]+|[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$.*/;
    
            Client.find(
                {
                    $or:[
    
                        { fname: { $regex: regex.exec( data ), $options: 'i' } },
                        { lname: { $regex: regex.exec( data ), $options: 'i' } }
                    ]
                }
            )
            .then( results => {
    
                res.status( 200 ).json( results );
            } )
            .catch( err => {
                throw err;
            } )
        }
    }
    
}

module.exports.monthly_debt_update = async ( req, res ) => {

    const { payment_monthly_debt, paymentid } = req.body;

    let credit = await Credit;

    let cur_credit = await credit.findById( req.params.credit );

    let curr_payment = await Payment.findById( paymentid );

    if( parseInt( curr_payment.monthly_debt ) < parseInt( payment_monthly_debt ) ){
        res.json( { msg: `error` } );
    }
    else{
        curr_payment.monthly_debt = parseInt( curr_payment.monthly_debt ) - parseInt( payment_monthly_debt );
        curr_payment.payment = parseInt( curr_payment.payment ) + parseInt( payment_monthly_debt );
    }

    curr_payment.save().then( result => {
        res.json( { code: 200 } );
    } )
    .catch( err => {
        throw err;
    } )

    // Credit.findById( req.params.credit ).then( credit => {

    //     credit.payments.forEach( payment => {
            
    //         if( payment.id == paymentid ){

    //             if( payment.monthly_debt == parseInt( payment_monthly_debt ) ){

    //                 let curr_pay = parseInt( payment.payment ) + parseInt( payment_monthly_debt );

    //                 let curr_index = credit.payments.findIndex( p => p.id == paymentid );

    //                 credit.payments.splice( curr_index, 1 );

    //                 let updatedpayment = {
    //                     id: paymentid,
    //                     payment: curr_pay ,
    //                     date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
    //                      cur_date: moment().format()
    //                 }

    //                 credit.payments[curr_index] = updatedpayment;
    //             }
    //             else if( payment.monthly_debt  > parseInt( payment_monthly_debt ) ){
                    
    //                 let updatedpayment = {
    //                     id: paymentid,
    //                     payment: parseInt( payment.payment ) + parseInt( payment_monthly_debt ) ,
    //                     monthly_debt : parseInt( credit.monthly ) - ( parseInt( payment.payment ) + parseInt( payment_monthly_debt ) ),
    //                     date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
    //                     cur_date: moment().format()
    //                 }

    //                 let curr_index = credit.payments.findIndex( p => p.id == paymentid );
    //                 credit.payments.splice( curr_index, 1 );

    //                 credit.payments[curr_index] = updatedpayment;
    //             }
    //             else if( payment.monthly_debt  < parseInt( payment_monthly_debt ) ){
                    
    //             }
    //         }
    //     } );
        
    //     credit.save().then( resul => {

    //         res.json( { code: 200 } );
    //     } )
    //     .catch( err => {
            
    //         throw err;
    //     } );
    // } )
    // .catch( err => {
    //     throw err;
    // } )
}