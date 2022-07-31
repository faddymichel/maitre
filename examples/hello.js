export default function hello ( request, response ) {

const { default: { greeting, guest } } = this .contrato;

response .statusCode = 200;
response .statusMessage = 'Okay';

response .setHeader ( 'Content-Type', 'text/plain' );
response .end ( `${ greeting } ${ guest }! This is Maitre!\n`, 'utf8' );

};
