import Maitre from '../index.js';
import Shell from '@faddymichel/shell';
import { sep as separator } from 'path';

export default {

[ Symbol .for ( 'maitre/shell/environment' ) ]: {

port: 1313

},

[ Symbol .for ( 'maitre/shell/select' ) ] ( ... options ) {

const $ = this;
const { setting: shell } = $ ( Symbol .for ( 'scenarist/details' ) );

return Object .assign ( shell [ Symbol .for ( 'maitre/shell/environment' ) ], ... $ ( ... options ) );

},

async [ Symbol .for ( 'maitre/shell/main' ) ] ( path = 'service.js' ) {

const { setting: shell } = this ( Symbol .for ( 'scenarist/details' ) );
const { default: script } = await import ( path .startsWith ( separator ) ? path : `${ process .cwd () }/${ path }` );
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

const { port } = shell [ Symbol .for ( 'maitre/shell/environment' ) ];

maitre .listen ( parseInt ( port ) );

}
};
