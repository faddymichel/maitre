export default ( request, response ) => {

response .statusCode = 200;
response .statusMessage = 'Okay';

response .setHeader ( 'Content-Type', 'text/plain' );
response .end ( 'Hello World! This is Maitre!', 'utf8' );

};
