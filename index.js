import { Server } from 'http';
import IncomingMessage from './request.js';
import ServerResponse from './response.js';
import MaitreError from './error.js';
import dns from 'dns/promises';

export default class Maitre extends Server {

constructor ( options, ... parameters ) {

super ( Object .assign ( {

IncomingMessage, ServerResponse

}, options ), ... parameters );

const maitre = this;

maitre .on ( 'listening', async () => {

const { port } = maitre .address ();
const urls = ( await dns .getServers () ) .map ( address => `http://${ address }:${ port }` );

maitre .emit ( 'info', 'Listening at:\n', urls .join ( '\n' ) );

} );

}

listen ( ... parameters ) {

const maitre = this;

maitre .#start ()
.then ( () => super .listen ( ... parameters ) )
.catch ( error => maitre .emit ( 'error', error ) );

}

async #start () {

const maitre = this;

maitre .emit ( 'debug', 'Starting' );

try {

const path = process .cwd () + '/.maitre.js';

maitre .emit ( 'debug', `Importing 'contrato' from ${ path }` );

Object .defineProperty ( maitre, 'contrato', {

value: await import ( path ),
enumerable: true

} );

} catch ( error ) {

maitre .emit ( 'warning', "Couldn't find 'contrato'" );

}

maitre .on (

'request',
( ... request ) => maitre .#serve ( ... request )
.catch ( 'unserved', error => maitre .#handle ( error, ... request ) )

);

maitre .on (

'upgrade',
( ... request ) => maitre .#upgrade ( ... request )
.catch ( error => maitre .#handle ( 'notUpgraded', error, ... request ) )

);

}

async #serve ( request, response ) {

const maitre = this;

maitre .#log ( request, response );
maitre .emit ( 'debug', 'Received a new request' );

await response .provide ( await request .prepare ( maitre .contrato ) .service );

}

async #upgrade ( request, socket ) {

const maitre = this;

maitre .#log ( request, socket );

const { service } = await request .wsUpgrade ( maitre .contrato );

if ( typeof service !== 'function' )
throw MaitreError ( 501 );

socket .write (

`HTTP/${ request .httpVersion } 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: ${ request .wsAccept }

` );

}

#handle ( event, error, ... request ) {

const maitre = this;

if ( ! ( error instanceof MaitreError ) ) {

maitre .emit ( 'error', error .stack );

error = MaitreError ();

}

maitre .emit ( event, error, ... request );

}

async #log ( ... request ) {

const maitre = this;

for ( const order of request )
for ( const level of Maitre .logLevel )
order .on ( level, ( ... message ) => maitre .emit ( level, ... message ) );

}

static logLevel = [

'error',
'warning',
'info',
'debug'

]

};
