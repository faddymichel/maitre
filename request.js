import { IncomingMessage } from 'http';
import { createHash } from 'crypto';
import MaitreError from './error.js';

export default class Request extends IncomingMessage {

async prepare ( contrato ) {

const request = this;
const method = request .headers .upgrade && request .headers .upgrade .toLowerCase () === 'websocket' ? 'ws' : request .method .toLowerCase ();
const { pathname } = new URL ( request .url, `${ request .headers .protocol }://${ request .headers .host }` );
const path = process .cwd () + pathname + ( pathname .endsWith ( '/' ) ? '' : '/' );

request .emit ( 'debug', 'Preparing request' );

if ( path .includes ( '/.' ) )
throw MaitreError ( 400 );

let location, service;

try {

location = path + method + '.js';

request .emit ( 'debug', `Trying to import service from ${ location }` );

switch ( typeof ( service = await import ( location ) ) .default ) {

case 'object':
case 'function':

service = service .default;

}

} catch ( error ) {

if ( error .code !== 'ERR_MODULE_NOT_FOUND' )
throw error;

request .emit ( 'debug', "Couldn't find service" );

try {

location = path .slice ( 0, -1 ) + '.js';

request .emit ( 'debug', `Trying to import service from ${ location }` );

switch ( typeof ( service = await import ( location ) ) .default ) {

case 'function':

service = service .default;

break;

case 'object':

service = service .default;

default:

service = service [ method ];

}

} catch ( error ) {

if ( error .code !== 'ERR_MODULE_NOT_FOUND' )
throw error;

request .emit ( 'debug', "Couldn't find service" );
throw MaitreError ( 404 );

}

}

request .emit ( 'debug', 'Imported service successfully' );

return Object .defineProperties ( request, {

location: {

value: location,
enumerable: true

},
service: {

value: typeof service === 'function'  && typeof service .bind === 'function' ? service .bind ( contrato ) : service,
enumerable: true

}

} );

}

static #wsMagic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

async wsUpgrade ( contrato ) {

const request = this;
let key;

if (

request .httpVersion < '1.1'
|| request .method !== 'GET'
|| request .headers .upgrade .toLowerCase () !== 'websocket'
|| request .headers [ 'sec-websocket-version' ] !== '13'
|| Buffer .byteLength ( key = request .headers [ 'sec-websocket-key' ], 'base64' ) !== 16

)
throw MaitreError ( 400 );

await request .prepare ( contrato );

const hash = createHash ( 'sha1' );

hash .update ( key + Request .#wsMagic );

return Object .defineProperty ( request, 'wsAccept', {

value: hash .digest ( 'base64' ),
enumerable: true

} );

}

};
