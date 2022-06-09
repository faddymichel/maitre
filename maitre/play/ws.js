const play = {};
export default play;

export const establishment = play .establishment = function establishment () {

const setting = this;
const { teatro, scenarist, participant } = setting;
let { prompt } = scenarist .setting;

teatro .on ( 'close', () => {

participant .removeAllListeners ();
participant .close ();

console .error ( '#ws', '#close' );

} );

participant .on ( 'error', ( error ) => {

console .error ( '#ws #error' );

} );

participant .on ( 'message', ( line ) => {

line = line .trim ();

if ( ! line )
return;

line = line .split ( ' ' );

if ( line .length === 0 )
return;

const script = {

event: line [ 0 ],
action: line [ 1 ],
details: line .splice ( 2 ) .join ( ' ' )

};

scenarist .play ( script )
.then ( ( output ) => {

if ( typeof output !== 'string' )
return;

participant .send ( `${ output .trim () }\n` );

participant .send ( scenarist .setting .prompt );

} )
.catch ( ( error ) => {

let message;

if ( typeof error === 'string' )
message = error .trim ();

else if ( error instanceof Error )
message = error .message .trim ();

participant .send ( `\n#error ${ message }\n` );

participant .send ( scenarist . setting .prompt );

} );

} );

};

export const character = play .character = {};

character .events = [ '?maitre\n...', '#maitre' ];
character .action = function action ( script, cue, blooper ) {

cue ();

};
