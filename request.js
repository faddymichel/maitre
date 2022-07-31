import { IncomingMessage } from 'http';
import MaitreError from './error.js';

export default class Request extends IncomingMessage {

async prepare () {

const request = this;
const method = request .method .toLowerCase ();
const { pathname } = new URL ( request .url, `${ request .headers .protocol }://${ request .headers .host }` );
const path = process .cwd () + pathname + ( pathname .endsWith ( '/' ) ? '' : '/' );

if ( path .includes ( '/.' ) )
throw MaitreError ( 400 );

let location, service;

try {

location = path + method + '.js';
service = await import ( location );

} catch ( error ) {

try {

location = path .slice ( 0, -1 ) + '.js';
service = await import ( location );

Object .assign ( {

default: typeof service [ method ] === 'function' ? service [ method ] : service .default

}, typeof service [ method ] === 'object' ? service [ method ] : undefined );

} catch ( error ) {

throw MaitreError ( 404 );

}

}

return Object .defineProperties ( request, {

location: {

value: location,
enumerable: true

},
service: {

value: service,
enumerable: true

}

} );

}

};
