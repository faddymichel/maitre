import book from './responseCodes.js';

export default function MaitreError ( code, ... details ) {

const error = Error ( book [ code = book [ code ] ? code : 500 ] );

Error .captureStackTrace ( error, MaitreError );

Object .setPrototypeOf ( error, MaitreError .prototype );

Object .defineProperty ( error, 'code', {

value: code,
writable: true,
configurable: true

} );

Error .call ( error, book [ error .code ] );

return error;

};

Object .defineProperty ( MaitreError, 'prototype', {

value: Object .create ( Error .prototype )

} );

Object .defineProperties ( MaitreError .prototype, {

constructor: {

value: MaitreError,
writable: true,
configurable: true

},
name: {

value: 'MaitreError',
writable: true,
configurable: true

},
toString: {

value: function toString () {

return `MaitreError: ${ this .code } ${ this .message }`;

},
writable: true,
configurable: true

}

} );
