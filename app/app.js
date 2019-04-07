const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const oldInput = require('old-input');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const app = express();

const router = express.Router();

// Passport Config
require( './config/passport' )( passport );

const { ensureAuthenticated } = require('./config/auth');
// DB Config
const db = require( './config/keys' ).mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then( () => console.log( 'MongoDB Connected' ) )
  .catch( err => console.log( err ) );

router.use( methodOverride( 'X-HTTP-Method' ) );          // Microsoft
router.use( methodOverride( 'X-HTTP-Method-Override' ) ); // Google/GData
router.use( methodOverride( 'X-Method-Override' ) );  // IBM

// EJS
const { sep } = require( 'path' );
// app.use( expressLayouts );
// app.set( 'views', __dirname + sep +'views' );
app.set( 'view engine', 'ejs' );

// Express body parser
app.use( express.urlencoded( { extended: true } ) );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Express session
app.use(
  session( {
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  } )
);
app.use(oldInput);

app.use(methodOverride(function (req, res) {
  
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// Passport middleware
app.use( passport.initialize() );
app.use( passport.session() );

// Connect flash
app.use( flash() );

//Static Directories

app.use( "/css", express.static( __dirname + sep + 'static' + sep + 'css' ) );
app.use( "/js", express.static( __dirname + sep + 'static' + sep + 'js' ) );
app.use( "/jquery", express.static( __dirname + sep + 'static' + sep + 'js' + sep + 'jquery' ) );
app.use( "/bootstrap", express.static( __dirname + sep + 'static' + sep + 'bootstrap' ) );
app.use( "/fonts", express.static( __dirname + sep + 'static' + sep + 'fonts' ) );
app.use( "/static_img", express.static( __dirname + sep + 'static' + sep + 'images' ) );
app.use( "/client_img", express.static( __dirname + sep + 'data' + sep + 'documents' ) );

// Global variables

app.use( function( req, res, next ) {

  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
} );

// Routes 
app.use( '/', require( './routes/index' ) );
app.use( '/users', require( './routes/users' ) );
app.use( '/products',
ensureAuthenticated, 
require( './routes/products' ) );

app.use( '/clients',
ensureAuthenticated, 
require( './routes/clients' ) );
app.use( '/credits',
ensureAuthenticated, 
require( './routes/credits' ) );
app.use( '/api', 
ensureAuthenticated,
require( './routes/api' ) );


module.exports = app; 

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, console.log(`Server started on port ${PORT}`));

