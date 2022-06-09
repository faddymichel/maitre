import { Scenarist } from '@teatro13/scenarist';
import { cast } from './cast.js';

const prompt = '\n?maitre\n... ';

export const Opening = ( key ) => {

return function opening () {

const production = {};
const teatro = this;
const ownerScenarist = new Scenarist ();
ownerScenarist .scenario ( {

name: 'maitre',
setting: {

teatro: teatro,
key: key,
participant: {

input: process .stdin,
output: process .stdout,
error: process .stderr

},
prompt: prompt,
signature: Symbol (),
production: production,
venue: {}

},
paths: cast ( [

'script.js',
'venue.js',
'contrato.js'

] ),
establish: true

} )
.then ( () => {

ownerScenarist .display = 'maitre';

const { terminal, participant } = ownerScenarist .setting;

terminal .write ( '#maitre #ready\n' );
participant .output .write ( prompt );

} );

teatro .on ( 'participant', ( participant ) => {

[ 'close', 'error', 'end' ] .forEach ( ( event ) => {

participant .on ( event, ( error ) => {

console .error ( event, error );

} );

} );

const participantScenarist = new Scenarist ();
participantScenarist .scenario ( {

name: 'maitre',
setting: {

teatro: teatro,
participant: participant,
prompt: prompt,
signature: Symbol (),
production: production,
venue: {}

},
paths: cast ( [

'./ws.js',
'./contrato.js'

] ),
establish: true

} )
.then ( () => {

participantScenarist .display = 'maitre';

participant .send ( '#maitre #ready\n' );
participant .send ( prompt );

} );

} );

};

};
