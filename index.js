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

maitre .#start ();

maitre .on ( 'listening', async () => {

const { port } = maitre .address ();
const urls = ( await dns .getServers () ) .map ( address => `http://${ address }:${ port }` );

maitre .emit ( 'info', 'Listening at:\n', urls .join ( '\n' ) );

} );

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

maitre .on ( 'request', ( ... order ) => maitre .#serve ( ... order )
.catch ( error => {

if ( ! ( error instanceof MaitreError ) ) {

maitre .emit ( 'error', error );
error = MaitreError ();

}

maitre .emit ( 'unserved', ... order, error );

} ) );

maitre .emit ( 'ready' );
maitre .emit ( 'debug', 'Ready' );

}

async #serve ( request, response ) {

const maitre = this;
let service;

maitre .emit ( 'debug', 'Serving an incoming request' );

service = typeof ( service = await request .prepare () ) === 'function' ? await service .default .call ( maitre, request, response ) : service;

response .provide ( service );

maitre .emit ( 'debug', 'Service provided successfully' );

}

};
