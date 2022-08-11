export const post = function post ( request, response ) {

console .log ( 'yallah' );

const { safe } = this;

request .setEncoding ( 'utf8' );
request .on ( 'data', body => {

console .log ( '#body', body );

const [ user, password ] = body .split ( ':' );

console .log ( '#user', user );
console .log ( '#password', password );

safe .register ( user, password );

} );

};
