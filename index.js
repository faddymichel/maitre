#!/usr/bin/env node

import http from 'http';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import notFoundPage from './notFoundPage.js';

const { argv } = yargs ( hideBin ( process.argv ) );
const server = http .createServer ();

server .on ( 'request', async ( message, response ) => {

console .log ( '#maitre', '#http', '#request', Date () );

const { pathname } = new URL ( message .url, `${ message .headers .protocol }://${ message .headers .host }` );
const module = process .cwd () + pathname + message .method .toLowerCase () + '.js';
let service;

console .log ( '#maitre', '#import', module );

try {

service = await import ( module );

} catch ( error ) {

console .error ( '#error', error .name, error .message );

response .statusCode = 404;
response .statusMessage = 'Not Found';

response .setHeader ( 'content-type', 'text/html' );
response .setHeader ( 'Content-Length', Buffer .byteLength ( notFoundPage ) );

response .end ( notFoundPage, 'utf8' );

return console .log ( '#response', '#end', Date () );

}

if ( typeof service .default === 'function' )
service = service .default ( message );

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

console .log ( '#response', '#end', Date () );

} );

server .on ( 'error', error => console .error ( '#maitre', '#error:', error ) );

const port = typeof argv .port === 'number' ? argv .port : 1313;

server .listen ( port, () => console .log ( '#maitre', '#listening', '#port', port, Date () ) );
