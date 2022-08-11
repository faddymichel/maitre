import { ServerResponse } from 'http';
import MaitreError from './error.js';

export default class Response extends ServerResponse {

async provide ( service ) {

const response = this;

switch ( typeof service ) {

case 'function':
return response .provide ( await service .call ( service .contrato, response .req, response ) );

case 'undefined':
throw MaitreError ( 204 );

case 'boolean':
throw MaitreError ( service ? 200 : 404 );

case 'number':
throw MaitreError ( service );

}

if ( typeof service !== 'object' )
throw MaitreError ( 501 );

response .emit ( 'debug', 'Providing response' );

let { headers, body, encoding, statusCode, statusMessage } = service;

if ( response .headersSent === true )
response .emit ( 'debug', 'Response headers are already sent' );

else {

response .emit ( 'debug', 'Writing response headers' );

if ( typeof statusCode === 'number' )
response .statusCode = statusCode;

if ( typeof statusMessage === 'string' )
response .statusMessage = statusMessage;

let name, value;

if ( typeof headers === 'object' )
for ( name of Object .keys ( headers ) )
if ( typeof name === 'string' && typeof ( value = headers [ name ] ) === 'string' )
response .setHeader ( name, value );

}

if ( response .writableEnded === true )
response .emit ( 'debug', 'Writing response body has already ended' );

else {

response .emit ( 'debug', 'Writing response body' );

body = await Promise .resolve ( body );

if ( typeof body === 'string' || body instanceof Buffer )
response .end ( body, encoding );

}

response .emit ( 'debug', 'Response provided successfully' );

}

};
