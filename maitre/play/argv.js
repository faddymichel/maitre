import yargs from 'yargs';

export const argv = yargs
.option ( 'host', {

alias: 'H',
group: 'Address:',
description: 'The host on which Teatro will listen for new connections.',
default: 'localhost',
type: 'string'

} )
.option ( 'port', {

alias: 'P',
group: 'Address:',
description: 'The port on which Teatro will listen for new connections.',
default: 1313,
type: 'number'

} )
.option ( 'paths', {

alias: 'C',
group: 'Opening',
description: 'Paths to be imported as cast for Teatro opening scenario.',
type: 'array'

} )
.argv;
