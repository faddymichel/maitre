import EventEmitter from 'events';
import { mkdir, writeFile } from 'fs/promises';
import { createHash } from 'crypto';

export default class Safe extends EventEmitter {

#location;
#records = {};

constructor ( location ) {

super ();

const safe = this;

safe .#location = ( location || process .cwd () ) + '/.safe/';

mkdir ( safe .#location, {

mode: '700'

} )
.catch ( error => error .code === 'EEXIST' ? safe : maitre .close ( () => console .error ( '#error', error .code || error .name, error .message, Date () ) ) )
.finally ( () => safe .emit ( 'ready' ) );

}

register ( user, password ) {

const safe = this;
const location = safe .#location + user;

if ( ! safe .#records [ user ] )
open ( location )
.catch ( () => safe .#records [ user ] = writeFile ( user, createHash ( 'sha256' )
.update ( password )
.digest ( 'hex' ) ) );

}

login ( request, response ) {

const header = request .getHeader ( 'Authorization' );

if ( ! header ) {

response .statusCode = 401;
response .statusMessage = 'Unauthorized';

response .setHeader ( 'WWW-Authenticate', 'Basic' );
response .end ( "Bouncer couldn't find an 'Authorization' header" );

}

}

};
