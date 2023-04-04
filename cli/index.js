#!/usr/bin/env node

import Scenarist from '@faddymichel/scenarist';
import options from './options.js';
import shell from './shell.js';

const $ = Scenarist ( {

script: options,
setting: shell

} );

let argv = process .argv .slice ( 2 );
const path = argv [ argv .length - 1 ];
const optionsArgv = [];

for ( const argument of argv .length > 1 ? argv .slice ( 0, -1 ) : [] )

if ( argument .startsWith ( '--' ) )
optionsArgv .push ( ... argument .split ( '=' ) );

else if ( argument [ 0 ] === '-' && argument .length > 2 )
optionsArgv .push ( argument .slice ( 0, 2 ), argument .slice ( 2 ) );

else
optionsArgv .push ( argument );

try {

if ( optionsArgv .length )
await $ ( Symbol .for ( 'maitre/shell/select' ), ... optionsArgv );

await $ ( Symbol .for ( 'maitre/shell/main' ), path );

} catch ( error ) {

console .error ( error );

}
