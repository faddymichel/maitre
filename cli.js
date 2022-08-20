#!/usr/bin/env node

import Maitre from './index.js';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const { argv } = yargs ( hideBin ( process.argv ) );
const maitre = new Maitre ();

for ( const level of Maitre .logLevel ) {

maitre .on ( level, ( ... details ) => {

const time = new Date ();

details .forEach ( ( detail, index ) => {

if ( detail instanceof Error )
details [ index ] = detail .message;

} );

const stream = level === 'info' ? 'log' : 'error';

console [ stream ] ( `#${ level } ${ time .toLocaleDateString () } ${ time .toLocaleTimeString () }` );
console [ stream ] ( 'Maitre:', ... details );

} );

}

maitre .on ( 'unserved', ( error, request, response ) => response .provide ( {

statusCode: error .code,
statusMessage: error .statusMessage,
headers: {

'Content-Type': 'text/plain'

},
body: error .toString () + '\n'

} ) );

maitre .on ( 'notUpgraded', ( error, request, socket ) => socket .end (

`HTTP/${ request .httpVersion } ${ error .code } ${ error .statusMessage }
Content-Type: text/plain
${ error .toString () }

` ) );

const port = typeof argv .port === 'number' ? argv .port : 1313;

maitre .listen ( port );
