import { WebSocket } from 'ws';
import { createInterface } from 'readline';

const socket = new WebSocket ( 'ws://localhost:1313' );
const cli = createInterface ( {

input: process .stdin,
output: process .stdout

} );

cli .on ( 'line', line => {

socket .send ( line );

} );

socket .on ( 'message', message => {

console .log ( '< %s', message );

cli .prompt ();

} );
