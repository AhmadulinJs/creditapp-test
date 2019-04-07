const { sep } = require( 'path' );
const Credit = require( '../models/credits' );
const moment = require( 'moment' );
const Payment = require( '../models/payments' );
moment.locale('ru');

module.exports.Index = ( req, res ) => res.redirect( '/users/login' , ); //res.render(__dirname + sep + '..'+ sep + 'views'+ sep  + 'welcome');

module.exports.Dashboard = async ( req, res ) =>{

    let crteditsUSD = await Credit.find( { currency: "USD", status: false } );
    let crteditsUZS = await Credit.find( { currency: "UZS", status: false } );
    let data = await Credit.find( {  date_of_payment: moment().get('date'), status: false, } ).count();
    
    let AllPriceUSD = 0;
    let AllPriceUZS = 0;

    crteditsUSD.forEach( cr => {
        AllPriceUSD = cr.price + AllPriceUSD;
    } );

    crteditsUZS.forEach( cr => {
        AllPriceUZS = cr.price  + AllPriceUZS;
    } );


    let cur_month = moment().month() + 1;
    let cur_y = moment().year();

    let month_debtUZS = 0;
    let month_debtUSD = 0;
    let payments = await Payment.find( { year:cur_y, $or:[
        { month: cur_month },
        { month:{ $lt:cur_month } }
    ]  } );
    // .where( 'month' ).equals( cur_month ).where().gt(0).lt( cur_month )
    payments.forEach( pay => {

        // console.log( pay.date );


        if( pay.credit_id.currency == 'USD' ){

            month_debtUSD = month_debtUSD + pay.monthly_debt;
        }
        else{
            month_debtUZS += month_debtUZS + pay.monthly_debt;
        }
    } );
    res.render( __dirname + sep + '..'+ sep + 'views'+ sep  + 'dashboard',

        {
            title: `Dashboard` ,
            user: req.user,
            counted_data: data,
            PriceUZS: AllPriceUZS + ` UZS`,
            PriceUSD: AllPriceUSD + ` USD`,
            MonthlyUZS: month_debtUZS + ` UZS`,
            MonthlyUSD: month_debtUSD + ` USD`,
        } 
    );

    // .where( 'date_ch.year' ).equals( cur_y ).where( 'date_ch.month' ).equals( cur_month );

    // // const regex = /(?:-|)([\d]+)-([\d]+)/;

    // console.log( regex.exec( '2019-3' ) );
    // console.log( payments );

    // console.log( console.log( regex.exec( `${moment().year()}-${moment().month() + 1}` ) ) );
    
    // let paymentsUSD = 0;

    // console.log( AllPriceUSD );


    // Credit.find( {  date_of_payment: moment().get('date'), status: false, } ).count().then( data => {

    //     var allPriceUZS = 0, allPriceUSD = 0, allMonthlyUZS = 0, allMonthlyUSD = 0;

    //     Credit.find( { status: false } ).then( credits => {

    //         credits.forEach( credit => {

    //             if( credit.currency == `UZS` ){
                    
    //                 allPriceUZS += credit.debts;
                    
    //                 if( credit.payments.length > 0){
    //                     if( 
    //                         moment().month()+ 1 != moment( credit.payments[0].cur_date ).month()+1 
    //                         && parseInt( moment( credit.date ).month()+1 ) != parseInt( moment().month()+ 1 )
    //                     ) {

    //                         allMonthlyUZS += credit.monthly;
    //                     }
    //                     else if( moment().month()+ 1 == moment( credit.payments[0].cur_date ).month()+1  ) {
    //                         if( credit.payments[0].monthly_debt ){

    //                             allMonthlyUZS += credit.payments[0].monthly_debt;
    //                         }
    //                     }
    //                 }
    //                 else{

    //                     allMonthlyUZS += credit.monthly;
    //                 }
    //             }
    //             else{

    //                 allPriceUSD += credit.debts;
                    
    //                 if( credit.payments.length > 0){

    //                     // console.log( moment( credit.payments[credit.payments.length-1].cur_date ).month()+1  );

    //                     if( 
    //                         moment().month()+ 1 != moment( credit.payments[0].cur_date ).month()+1 && 
                          
    //                         parseInt( moment( credit.date ).month()+1 ) != parseInt( moment().month()+ 1 ) 
    //                     ){
                            
    //                         allMonthlyUSD += credit.monthly;
    //                     }
    //                     else if( moment().month()+ 1 == moment( credit.payments[0].cur_date ).month()+1  ){ 

    //                         if( credit.payments[0].monthly_debt ){

    //                             allMonthlyUSD += credit.payments[0].monthly_debt;
    //                         }
    //                     }
    //                 }
    //                 else{

    //                     allMonthlyUSD += credit.monthly;
    //                 }
    //             }
    //         } );

    //         res.render( __dirname + sep + '..'+ sep + 'views'+ sep  + 'dashboard',

    //             {
    //                 title: `Dashboard` ,
    //                 user: req.user,
    //                 counted_data: data ,
    //                 PriceUZS: allPriceUZS + ` UZS`,
    //                 PriceUSD: allPriceUSD + ` USD`,
    //                 MonthlyUZS: allMonthlyUZS + ` UZS`,
    //                 MonthlyUSD: allMonthlyUSD + ` USD`,
    //             } 
    //          );
    //     } )
        
    // } );
    
} 