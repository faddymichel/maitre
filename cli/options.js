const options = {};

export default options;

options [ '$--port' ] = options [ '$-p' ] = ( port = 1313, ... options ) => {

return[ { port: isNaN ( port ) ? this .port : port }, ... options ];

};
