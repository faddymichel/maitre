import http from 'http';
import notFound from './notFound.js';

export default class Maitre extends http .Server {

constructor ( ... parameters ) {

super ( ... parameters );

const maitre = this;

maitre .on ( 'request', async ( order, delivery ) => {

console .log ( '#http', '#request', Date () );

let service;

try {

service = await maitre .#prepare ( order );

} catch ( error ) {

console .error ( '#error', error .name, error .message, Date () );

service = notFound;

}

if ( typeof service .default === 'function' )
service = service .default ( order );

const { headers, body, encoding, statusCode, statusMessage } = service;

if ( typeof statusCode === 'number' )
delivery .statusCode = statusCode;

if ( typeof statusMessage === 'string' )
delivery .statusMessage = statusMessage;

let name, value;

if ( typeof headers === 'object' )
for ( name of Object .keys ( headers ) )
if ( typeof name === 'string' && typeof ( value = headers [ name ] ) === 'string' )
delivery .setHeader ( name, value );

if ( typeof body === 'string' || body instanceof Buffer )
delivery .end ( body, encoding );

console .log ( '#delivery', '#end', Date () );

} );

}

async #prepare ( order ) {

const { pathname } = new URL ( order .url, `${ order .headers .protocol }://${ order .headers .host }` );
const location = process .cwd () + pathname + ( pathname .endsWith ( '/' ) ? '' : '/' );

if ( location .includes ( '..' ) )
throw Error ( "Path to Service Module can't contain '..'" );

console .log ( '#import', location + order .method .toLowerCase () + '.js' );

return import ( location + order .method .toLowerCase () + '.js' )
.catch ( error => {

console .error ( '#error', error .name, error .message );
console .log ( '#import', location + 'service.js' );

return import ( location + 'service.js' );

} )
.then ( service => Object .assign ( { default: service .default }, service [ order .method ] ) );

}

};
