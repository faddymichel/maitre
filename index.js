import http from 'http';
import notFound from './notFound.js';

export default class Maitre extends http .Server {

constructor ( ... parameters ) {

super ( ... parameters );

const maitre = this;
const contrato = import ( process .cwd () + '/maitre.js' ) .catch ( () => {} );

maitre .on ( 'request', ( ... request ) => maitre .#serve ( ... request, contrato ) );

}

async #serve ( order, delivery, contrato ) {

console .log ( '#http', '#request', Date () );

const maitre = this;
let service;

try {

service = await maitre .#prepare ( order );

} catch ( error ) {

console .error ( '#error', error .name, error .message, Date () );

service = notFound;

}

if ( typeof service .default === 'function' )
try {

return service = service .default .call ( await contrato, order, delivery );

} catch ( error ) {

console .error ( '#error', error .name, error .message, Date () );

service = notFound;

}

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

}

async #prepare ( order ) {

const { pathname } = new URL ( order .url, `${ order .headers .protocol }://${ order .headers .host }` );
const location = process .cwd () + pathname + ( pathname .endsWith ( '/' ) ? '' : '/' );

if ( location .includes ( '..' ) )
throw Error ( "Path to Service Module can't contain '..'" );

let path = location + order .method .toLowerCase () + '.js';

console .log ( '#import', path );

return import ( path )
.catch ( error => {

path = location .slice ( 0, -1 ) + '.js';

console .error ( '#error', error .name, error .message );
console .log ( '#import', path );

return import ( path )
.then ( service => Object .assign ( { default: service .default }, service [ order .method ] ) );

} );

}

};
