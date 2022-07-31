import { ServerResponse } from 'http';
import MaitreError from './error.js';

export default class Response extends ServerResponse {

provide ( service ) {

if ( typeof service !== 'object' )
throw MaitreError ( 501 );

const response = this;
const { headers, body, encoding, statusCode, statusMessage } = service;

if ( typeof statusCode === 'number' )
response .statusCode = statusCode;

if ( typeof statusMessage === 'string' )
response .statusMessage = statusMessage;

let name, value;

if ( typeof headers === 'object' )
for ( name of Object .keys ( headers ) )
if ( typeof name === 'string' && typeof ( value = headers [ name ] ) === 'string' )
response .setHeader ( name, value );

if ( typeof body === 'string' || body instanceof Buffer )
response .end ( body, encoding );

}

};
