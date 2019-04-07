const { sep } = require( 'path' );
const path = require( 'path' );
const { perPage } = require( '../config/keys' );
const Client = require( '../models/clients' );
const Credit = require( '../models/credits' );
const Payment = require( '../models/payments' );
const mongoose = require( 'mongoose' );
const fs = require( `fs` );
const moment = require( 'moment' );
moment.locale('ru');


module.exports.NewClientGet = ( req, res ) => res.render( __dirname + sep + '..' + sep + 'views' + sep + 'clients' + sep + 'newclient', {title: 'Новый клиент'} );

module.exports.NewClientPost = ( req, res ) => {

    // console.log( req.body )
  
    const { fname, lname, tel, info } = req.body;
    let errors = [];

    if( !fname || !lname || !tel  ) {
        errors.push( { msg: 'Пожалуйста введите все формы' } );
        return res.render( __dirname + sep + '..' + sep + 'views' + sep + 'clients' + sep + 'newclient', { errors :errors, title: 'Новый клиент', oldInput: req.oldInput }  );
    }
    

    let files = [];
    req.files.forEach( file => {

        files.push( file.filename );
    } );

    const client = new Client( {
        fname,
        lname,
        tel,
        info,
        files : files,
    } );

    client.save().then( cl => {
        req.flash(
            'success_msg',
            'Вы сейчас создали новый клиент'
        )
        res.redirect('/clients/list/1');
    } );
}

module.exports.ListClients = ( req, res, next ) => {

    let page = req.params.page || 1;

    Client
    .find({})
    .sort( {date: 'desc'} )
    .skip( ( perPage * page ) - perPage )
    .limit( perPage )
    .then( clients => {

        Client
        .count()
        .exec()
        .then( count => {

            res.render(  
                __dirname + sep + '..' + sep + 'views' + sep + 'clients' + sep + 'listclients', 
                {
                    clients: clients,
                    current: page,
                    pages: Math.ceil( count / perPage )
                }  
            );
        } ).catch( err => next( err ) );

    } ).catch( err=> next( err ) );
}

module.exports.ClientPage = ( req, res ) => {

    Client.findById( req.params.id ).then( client => {
        
        req.session.clientId = client._id;

        Credit.find( { client: req.params.id } )
        .then( credits => {

            // console.log( credits );

            res.render( 
                __dirname + sep + '..' + sep + 'views' + sep + 'clients' + sep + 'client_page',
                {   
                    title: client.fname + ' ' + client.lname,
                    client: client,
                    credits: credits,
                    moment: moment
                }
            );

        } ).catch( err => console.log( err ) )
    } )
    .catch( err => {

        res.status( 404 ).send( `Страница не найдена` );
    } )
}

module.exports.EditClientProfile = ( req, res ) => {

    if( req.params.id != req.session.clientId ) return res.send( 400 );

    const { fname, lname, tel, info } = req.body;

    if( !fname || !lname || !tel  ) {

        req.flash(
            'error_msg',
            'Пожалуйста, введите все поля'
        );

        return res.redirect( '/clients/profile/'+ req.session.clientId );
    }

    Client.findByIdAndUpdate( req.params.id, { 
        fname:fname,
        lname:lname,
        tel:tel,
        info:info
    } )
    .then( result => {
        req.flash(
            'success_msg',
            "Вы отредактированы клиент"
        );
        res.redirect('/clients/profile/' + req.params.id );
    } ).catch( err => {

        throw err;
    } );

}

module.exports.DeleteImages = ( req, res ) => {

    const { id, img } = req.params;

    if( req.session.clientId != id ) return res.json( { status:404, error: ` EROR 404 Не Найдено`} );

    Client.findById( id )
    .then( client => {

        let current_img = client.files.indexOf( img );

        client.files.splice( current_img, 1 );

        client.save().then( resl => {

            let curr_path =  path.join( __dirname + sep + '..' + sep + `data` + sep + `documents`+ sep + img );
            fs.unlink( curr_path ,function( err ){
                // if( err ) return console.log( err );
                
                res.json( {status:200, msg: `Изображение удалено`} );
            } );  
        } )
        .catch( error => {
            throw error;
        } );

    } ).catch( err => {

        throw err;
    } );

}

module.exports.AddPayment = ( req, res ) => {
    
    const { credit, payment } =  req.body;

    if( !payment || !credit ) {
        req.flash(
            'error_msg',
            'Пожалуйста, введите все поля'
        );
        return res.redirect( '/clients/profile/'+ req.params.id );
    }
    Credit.find( { client: req.params.id } ).then( cr => {

        cr.forEach( c => {
            if( c._id == credit ){

                if( c.payments.length == 0 ){

                    if( payment == c.monthly ){

                        c.payments.push( 
                            {
                                id: new mongoose.Types.ObjectId(), 
                                payment: parseInt( payment ), 
                                date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"), 
                                cur_date: moment().format() 
                            }
                        );
                        c.save().then( () => {
                            req.flash(
                                'success_msg',
                                'Теперь вы добавляете оплату'
                            );
                            return res.redirect( '/clients/profile/'+ req.params.id );
                        } );
                    }
                    else if( payment < c.monthly ){

                        c.payments.push( 
                            {
                                id: new mongoose.Types.ObjectId(), 
                                payment: parseInt( payment ),
                                monthly_debt: parseInt( c.monthly  ) - parseInt( payment ),
                                date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"), 
                                cur_date: moment().format() 
                            }
                        );
                        c.save().then( () => {
                            req.flash(
                                'success_msg',
                                'Теперь вы добавляете оплату'
                            );
                            return res.redirect( '/clients/profile/'+ req.params.id );
                        } );
                    }
                     
                    
                }
                else{
                    if( payment < c.monthly ){
                        c.set( 'set_payment', {

                            id: new mongoose.Types.ObjectId(),
    
                            payment: parseInt( payment ),

                            monthly_debt: parseInt( c.monthly  ) - parseInt( payment ),

                            date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
    
                            res: async function( result ) {
                                
                                if( !result ){
                                    req.flash(
                                        'error_msg',
                                        'Эта сумма перевышает ваш долг. Пожалуйста, попробуйте еще раз.'
                                    );
                                    return res.redirect( '/clients/profile/'+ req.params.id );
                                }
                                else{
                                    req.flash(
                                        'success_msg',
                                        'Теперь вы добавляете оплату'
                                    );
                                    return res.redirect( '/clients/profile/'+ req.params.id );
                                }
                            }
                        } );
                    }
                    else{
                        c.set( 'set_payment', {

                            id: new mongoose.Types.ObjectId(),
    
                            payment: parseInt( payment ),

                            date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
    
                            res: async function( result ) {
                                
                                if( !result ){
                                    req.flash(
                                        'error_msg',
                                        'Эта сумма перевышает ваш долг. Пожалуйста, попробуйте еще раз.'
                                    );
                                    return res.redirect( '/clients/profile/'+ req.params.id );
                                }
                                else{
                                    req.flash(
                                        'success_msg',
                                        'Теперь вы добавляете оплату'
                                    );
                                    return res.redirect( '/clients/profile/'+ req.params.id );
                                }
                            }
                        } );
                    }
                }
            }
        } );
    } )
}

module.exports.TodayDeptors = ( req, res, next ) => {

    let page = req.params.page || 1;

    Credit.find( {  date_of_payment:moment().get('date'), status: false, } )
    .sort( { date: 'desc' } )
    .skip( ( perPage * page ) - perPage )
    .limit( perPage )
    .exec()
    .then( credits => {

        Credit.count()
        .then( count => {
            res.render(  
                __dirname + sep + '..' + sep + 'views' + sep + 'clients' + sep + 'debtor_clients', 
                {
                    credits: credits,
                    current: page,
                    pages: Math.ceil( count / perPage )
                }  
            );

        } ).catch( err => next( err ) );

    } ).catch( err=> next( err ) );
}

module.exports.Monthly_Deptor_clients = ( req, res ) => {

    // Credit.find( {  date_of_payment: moment().get('date'), status: false, } ).count().then( data => {

    //     Credit.find( { $and: [

    //         {  },
    //     ] } )
    //     // .where( 'payment_size' ).equals(  )
    //     .then( credits => {
    //         res.send( credits );
    //     } )

    //     // Credit.aggregate()
    //     // .project( { "payment_size": { "$size": "payments" } } )
    //     // .group({ "count": { "$sum": "$payment_size" } })
    //     // .exec( ( err, result ) => {
    //     //     console.log( result )
    //     //     res.send( result );
    //     // } )
    // } )

    let page = req.params.page || 1; 
    let cur_month = moment().month() + 1;
    let cur_y = moment().year();
    Payment
    .find( { year:cur_y, $or:[
        { month: cur_month },
        { month:{ $lt:cur_month } }
    ]  } )
    // .sort( { date: 'desc' } )
    .skip( ( perPage * page ) - perPage )
    .limit( perPage )
    .exec()
    .then( credits => {

        // console.log( credits );

        Payment.count().exec()
        .then( count => {

            res.render(  
                __dirname + sep + '..' + sep + 'views' + sep + 'clients' + sep + 'monthly_deptor_clients', 
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