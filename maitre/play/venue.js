const play = {};
export default play;

export const character = play .character = {};
character .events = [ 'venue' ];
character .action = function action ( script, cue, blooper ) {

const { scenarist, teatro, key, venue, production, signature } = this;

switch ( script .action ) {

case 'produce':

if ( ! script .details || venue [ script .details ] )
return blooper ( 
new ReferenceError ( 'Missing Play argument' )
);

import ( process .cwd () + '/' + script .details )
.then ( ( { Play } ) => {

if ( typeof Play !== 'function' )
return blooper (
new TypeError ( "Play is not of type 'function'" )
);

production [ script .details ] = Play;

cue ( '#maitre #venue' );

} )
.catch ( ( error ) => {

return blooper ( error );

} );

break;

case 'close':

teatro .close ( key );

return;

default:

return cue ( '#order false\n' );

}

};
