import book from './responseCodes.js';
	
export default Object .defineProperty ( function ( code, ... details ) {

return new MaitreError ( code, ... details );

}, 'name', {

value: 'MaitreError',
configurable: true

} );

const MaitreError = class MaitreError extends Error {

constructor ( code, ... details ) {

super ( book [ code ] || book [ 500 ] );

const error = this;

Object .defineProperty ( error, 'code', {

value: book [ code ] ? code : 500,
writable: true,
configurable: true

} );

}

};

Object .defineProperties ( MaitreError .prototype, {

name: {

value: 'MaitreError',
writable: true,
configurable: true

}, toString: {

value: function toString () {

return `MaitreError: ${ this .code } ${ this .message }`;

},
writable: true,
configurable: true

}

} );
