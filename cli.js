#!/usr/bin/env node

import Maitre from './index.js';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const { argv } = yargs ( hideBin ( process.argv ) );
const maitre = new Maitre ();

for ( const level of Maitre .logLevel ) {

maitre .on ( level, ( ... details ) => {

const time = details .pop ();

details .forEach ( ( detail, index ) => {

if ( detail instanceof Error )
details [ index ] = detail .message;

} );

console .error ();
console .error ( `#${ level } ${ time .toLocaleDateString () } ${ time .toLocaleTimeString () }` );
console .error ( 'Maitre:', ... details );

} );

}

maitre .on ( 'unserved', ( request, response, error ) => response .provide ( {

statusCode: error .code,
statusMessage: error .statusMessage,
headers: {

'Content-Type': 'text/plain'

},
body: error .toString () + '\n'

} ) );

const port = typeof argv .port === 'number' ? argv .port : 1313;

maitre .listen ( port );
