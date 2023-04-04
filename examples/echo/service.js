export default {

$wsOpen ( { response } ) {

response .send ( 'You are now connected! I will echo back whatever text you send over!' );

},

$wsMessage ( { response, details: { data: message } } ) {

response .send ( message );

}

};
