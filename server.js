const http = require('http');
const app = require('./app/app');

const port = process.env.PORT || 8888;

const server = http.createServer( app );

server.listen( port, () => {

    console.log( `SERVER WAS RUNNING... ${port}` );
} );