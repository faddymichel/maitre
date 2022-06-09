import { argv } from './argv.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath ( import .meta .url );
const __dirname = dirname ( __filename );

export const cast = function cast ( paths ) {

return paths .map ( ( path ) => {

return `${ __dirname }/${ path }`;

} )
.concat ( argv .paths ?
argv .paths .map ( ( path ) => {

return `${ process .cwd () }/${ path }`;

} ) : [] );

};
