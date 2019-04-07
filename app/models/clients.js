const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema( {
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  info: {
    type: String,
    required: true
  },
  files: {
    type: Array,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
} );

// { versionKey: false,toObject: {
//   getters: true
//   },
//   toJSON: {
//   getters: true,
//   } }

ClientSchema.set( 'toObject', { getters:true, versionKey:false, minimize:false } );

// ClientSchema.set( 'toObject',{ virtuals: true } );
// ClientSchema.set( 'toJSON',{ virtuals: true } );


const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
