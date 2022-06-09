const play = {};
export default play;

export const character = play .character = {};
character .events = [ 'contrato', '#contrato' ];
character .action = function action ( script, cue, blooper ) {

const { participant, scenarist, teatro, key, production, venue, signature } = this;
let stamp;

switch ( script .action ) {

case 'start':
case 'new':

if ( ! script .details || ! production [ script .details ] )
return blooper (
new ReferenceError ( 'Play does not exist' )
);

const playKey = teatro .host ( production [ script .details ] ( {} ), signature );

if ( ! playKey )
return blooper (
new Error ( 'Could not host Play on Teatro' )
);

stamp = teatro .issue ( playKey );

venue [ stamp ] = playKey;

cue ( `#maitre #stamp ${ stamp }` );

break;

case 'play':

const ticket = teatro .retrieve ( script .details );

if ( ! ticket )
return blooper ( '#maitre #ticket undefined' );

teatro .play (
participant,
ticket,
scenarist, cue, blooper
);

break;

case 'end':

if ( teatro .end ( venue [ script .details ], signature ) )
cue ( `#maitre #end ${ script .details } ${ delete venue [ script .details ] }` );

return blooper ( `#maitre #end ${ script .details } false` );

case 'issue':

stamp = teatro .issue ( venue [ script .details ] );

cue ( `#maitre #stamp ${ stamp }` );

case 'cancel':

if ( teatro .cancel ( script .details, signature ) )
cue ( `#maitre #cancel ${ script .details } true` );

return blooper ( `#maitre #cancel ${ script .details } false` );

default:

return blooper ( '#maitre #order false\n' );

}

};
