import { Server, OutgoingMessage } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import MaitreError from './error.js';
import dns from 'dns/promises';
import status from './status.js';

export default class Maitre extends Server {

constructor ( options ) {

super ( options );

const maitre = this;

maitre .on ( 'listening', maitre .#inform );

const { service } = options;

if ( typeof service !== 'function' )
throw TypeError ( "'options.service' must be a 'function'" );

Object .defineProperties ( maitre, {

service: {

value: service,
enumerable: true

},

ws: {

value: new WebSocketServer ( { server: maitre } ),
enumerable: true

}

} );

}

async #inform () {

const maitre = this;
const { port } = maitre .address ();
const URLs = ( await dns .getServers () ) .map ( address => `http://${ address }:${ port }
ws://${ address }:${ port }` );

maitre .emit ( 'info', 'Listening at:\n', URLs .join ( '\n' ) );

}

listen ( options ) {

const maitre = this;

maitre .#listen ()
.then ( () => super .listen ( options ) )
.catch ( error => maitre .emit ( 'error', error ) );

}

async #listen () {

const maitre = this;

maitre .emit ( 'debug', 'Starting' );

maitre .on (

'request',
( request, response ) => maitre .serve ( request, response )
.catch ( error => maitre .unserve ( request, response, error ) )

);

maitre .ws .on ( 'connection', ( socket, request ) => {

maitre .serve ( request, socket, { method: 'wsOpen' } )
.catch ( error => maitre .unserve ( request, socket, error )

);

socket .on (

'message',
( data, isBinary ) => maitre .serve ( request, socket, {

method: 'wsMessage',
details: { data, isBinary }

} )
.catch ( error => maitre .unserve ( request, socket, error ) )

);

} );

}

async serve ( request, response, order ) {

const maitre = this;

maitre .emit ( 'debug', 'Received a new request' );

const method = order ?.method || request .method .toLowerCase ();
const { pathname } = new URL ( request .url, `${ request .headers .protocol }://${ request .headers .host }` );
const location = [ ... pathname .split ( '/' ) .filter ( direction => direction ), method ];
const details = order ?.details;

maitre .emit ( 'debug', `Providing service at location: service.${ location .join ( '.' ) }` );

let service;

try {

service = maitre .service ( ... location, { request, response, details } );

} catch ( error ) {

if ( error .code === Symbol .for ( 'scenarist/error/unknown-direction' ) )
service = 404;

else
throw MaitreError ();

}

if ( response instanceof OutgoingMessage )
maitre .provide ( service, response );

}

async provide ( service, response ) {

const maitre = this;
let headers, body, encoding, code;

switch ( typeof service ) {

case 'undefined':
code = 204; break;

case 'boolean':
code = service ? 200 : 404; break;

case 'number':
code = service; break;

case 'string':
body = service; break;

case 'object':

( { headers, body, encoding, code } = service );

break;

default:

throw MaitreError ( 501 );

}

maitre .emit ( 'debug', 'Providing response' );

if ( response .headersSent === true )
maitre .emit ( 'debug', 'Response headers are already sent' );

else {

maitre .emit ( 'debug', 'Writing response headers' );

response .statusCode = code || 200;
response .statusMessage = status [ code ];

let name, value;

if ( typeof headers === 'object' )
for ( name of Object .keys ( headers ) )
if ( typeof name === 'string' && typeof ( value = headers [ name ] ) === 'string' )
response .setHeader ( name, value );

}

if ( response .writableEnded === true )
maitre .emit ( 'debug', 'Writing response body has already ended' );

else {

maitre .emit ( 'debug', 'Writing response body' );

body = await Promise .resolve ( body );

if ( typeof body !== 'string' && ! ( body instanceof Buffer ) )
body = `${ response .statusCode } ${ response .statusMessage }\n`;

response .end ( body, encoding );

}

maitre .emit ( 'debug', 'Response provided successfully' );

}

unserve ( request, response, error ) {

const maitre = this;

if ( ! ( error instanceof MaitreError ) ) {

maitre .emit ( 'error', error .stack );

error = MaitreError ();

}

maitre .emit ( 'unserved', request, response, error );

}

emit ( event, ... details ) {

super .emit ( event, ... details, new Date () );

}

static logLevel = [

'error',
'warning',
'info',
'debug'

]

};
