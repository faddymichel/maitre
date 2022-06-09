import { createInterface } from 'readline';

const play = {};
export default play;

export const establishment = play .establishment = function establishment () {

const setting = this;
const { teatro, key, scenarist, participant } = setting;
let { prompt } = scenarist .setting;

participant .input .setEncoding ( 'utf8' );
participant .output .setEncoding ( 'utf8' );

const tty = participant .input .isTTY;
const terminal = setting .terminal = ! tty ? participant .input : createInterface ( {

input: participant .input,
output: participant .output,
error: participant .error,
prompt: prompt

} );

terminal .on ( 'SIGINT', () => {

teatro .close ( key );

} );

const onError = ( error ) => {

terminal .removeAllListeners ();

terminal [ tty ? 'close' : 'end' ] ();

if ( error )
participant .error .write ( `\n#error ${ error .trim () }\n` );

};

if ( tty )
participant .input .on ( 'error', onError );

terminal .on ( 'error', onError );
teatro .on ( 'error', onError );
teatro .on ( 'close', onError );

const onLine = ( line ) => {

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

terminal .write ( `${ output .trim () }\n` );

participant .output .write ( scenarist .setting .prompt );

} )
.catch ( ( error ) => {

let message;

if ( typeof error === 'string' )
message = error .trim ();

else if ( error instanceof Error )
message = error .message .trim ();

participant .error .write ( `\n#error ${ message }\n` );

participant .output .write ( scenarist . setting .prompt );

} );

};

terminal .on ( tty ? 'line' : 'data', onLine );

};

export const character = play .character = {};

character .events = [ '?maitre\n...', '#maitre' ];
character .action = function action ( script, cue, blooper ) {

cue ();

};
