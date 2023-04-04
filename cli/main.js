export default async ( path = 'service.js', { port } ) => {

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

};
