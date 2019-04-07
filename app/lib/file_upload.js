const { sep } = require( 'path' );
const crypto = require( 'crypto' );
const multer = require('multer');

let date = new Date();

let string = date.getTime().toString();

let time = crypto.createHash( 'md5' ).update( string ).digest( 'hex' );

const uploadPath = __dirname + sep + '..' + sep + 'data' + sep + 'documents';

const storage = multer.diskStorage( {

  destination: function( req, file, cb ) {

    cb( null, uploadPath );
  },
  filename: function( req, file, cb ) {

    cb(null, time + '_' + file.originalname );
  }
} );

const fileFilter = ( req, file, cb ) => {
  // reject a file
  if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
    cb( null, true );
  } else {
    cb(null, false);
  }
};

const upload = multer( {

  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 16
  },
  fileFilter: fileFilter
} );


module.exports = upload;