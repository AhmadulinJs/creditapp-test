const mongoose = require('mongoose');

var schemaOptions = {
    versionKey: false,
};

const PaymentSchema = new mongoose.Schema( {
    credit_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Credit',
        autopopulate: true
    },
    // client_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Client',
    //     autopopulate: true
    // },
    payment:{
        type: Number,
        default: 0        
    },
    monthly_debt:{
        type: Number,
        default:0
    },
    date:{
        type: String,
    },
    year:{
        type:Number,
        default:0
    },
    month:{
        type: Number,
        default:0
    },
    day:{
        type:Number,
        default:0
    },
    created_date:{
        type: Date,
        default: Date.now
    },
}, schemaOptions );

PaymentSchema.plugin( require( 'mongoose-autopopulate' ) );

const Payment = mongoose.model( 'Payment', PaymentSchema );

module.exports = Payment;