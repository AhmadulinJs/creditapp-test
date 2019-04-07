const mongoose = require('mongoose');

var schemaOptions = {
    versionKey: false,
};

const CreditSchema = new mongoose.Schema( {
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client',
        autopopulate: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
        autopopulate: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    lifetime: {
        type: Number,
        required: true
    },
    remaining_month: {
        type: Number,
    },
    monthly: {
        type: Number, 
        required: true
    },
    currency: { /// valyuta
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false,
    },
    // monthly
    date_of_payment: {
        type: Number,
        required: true,
    },
    payments: {
        type: [ { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
            autopopulate: true,
        } ],
        default: []
    },
    credit_date: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, schemaOptions );

CreditSchema.set( 'toObject',{ virtuals: true } );
CreditSchema.set( 'toJSON',{ virtuals: true } );

CreditSchema.virtual( 'debts' )
.get( function() {

    var total = 0;
    
    for( let i = 0; i < this.payments.length; i++ ){

        total = total + this.payments[i].payment;
    }
    return this.price - this.amount - total;
} );

CreditSchema.virtual( 'monthly_payments' )
.get( function () {
    return this.lifetime -  this.payments.length;
} );

CreditSchema.virtual( 'set_payment' )
.set( function( newpayment ){

    if( (this.debts - newpayment.payment) > 0 ){

        this.payments.unshift( newpayment );
        this.save();
        newpayment.res( true );
    }
    else if( (this.debts - newpayment.payment) == 0 ){
        this.payments.unshift( newpayment );
        this.status = true;
        this.save()
        newpayment.res( true );
    }
    else{
        newpayment.res( false );
    }
} );

CreditSchema.virtual( 'payment_size' )
.get( function(){
    return this.payments.length;
} );

CreditSchema.plugin( require( 'mongoose-autopopulate' ) )

const Credit = mongoose.model( 'Credit', CreditSchema );

module.exports = Credit;
