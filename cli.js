#!/usr/bin/env node

import Maitre from './index.js';
import Scenarist from '@faddymichel/scenarist';
import Shell from '@faddymichel/shell';

const $ = Scenarist ( { script: {

path: './service.js',

[ '$--path' ] ( path, ... scenario ) {

this .path = path;

return $ ( ... scenario );

},

port: 1313,

[ '$--port' ] ( port, ... scenario ) {

this .port = isNaN ( port ) ? this .port : port;

$ ( ... scenario );

},

async $ () {

const { path, port } = this;
const { default: script } = await import ( `${ process .cwd () }/${ path }` );
const service = new Shell () [ Symbol .for ( 'shell/interpreter' ) ] ( script );
const maitre = new Maitre ( { service } );

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

maitre .on ( 'unserved', ( request, response, error ) => maitre .provide ( {

statusCode: error .code,
statusMessage: error .statusMessage,
headers: {

'Content-Type': 'text/plain'

},
body: error .toString () + '\n'

}, response ) );

maitre .listen ( parseInt ( port ) );

}

} } );

try {

await $ ( ... process .argv .slice ( 2 ), '' );

} catch ( error ) {

console .error ( error );

}
