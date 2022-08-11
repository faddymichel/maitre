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

maitre .on ( 'request', ( request, response ) => maitre .#serve ( request, response )
.catch ( error => {

if ( ! ( error instanceof MaitreError ) ) {

maitre .emit ( 'error', error .stack );

error = MaitreError ();

}

maitre .emit ( 'unserved', request, response, error );

} ) );

}

async #serve ( request, response ) {

for ( const order of [ request, response ] )
for ( const level of Maitre .logLevel )
order .on ( level, ( ... message ) => maitre .emit ( level, ... message ) );

const maitre = this;
let service;

maitre .emit ( 'debug', 'Received a new request' );

await response .provide ( await request .prepare ( maitre .contrato ) );

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
