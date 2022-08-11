import { IncomingMessage } from 'http';
import MaitreError from './error.js';

export default class Request extends IncomingMessage {

async prepare ( contrato ) {

const request = this;
const method = request .method .toLowerCase ();
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

} ) .service;

}

};
