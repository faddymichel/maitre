export default {

$yallah: {

$get: 'Salah Abdallah!\n'

},

greeting: 'Hello',
guest: 'World',

$get () {

return {

statusCode: 200,
statusMessage: 'OK',
body: `${ this .greeting } ${ this .guest }!\n`

};

}

};
