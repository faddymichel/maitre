export const character = {};
character .events = [ '?maitre\n...', '#maitre', 'maitre' ];
character .action = function action ( script ) {

const { play, input, output } = this;
const send = ( event ) => {

const contrato = document .getElementById ( 'contrato' );
input .ws .send ( `#contrato start ${ contrato .value }` );

};

switch ( script .action ) {

case '#ready':

input .ws .send ( `contrato start ${ play }` );

break;

case '#contrato':
case 'contrato':

if ( typeof script .details !== 'string' )
break;

const contrato = document .getElementById ( 'contrato' );
contrato .value = script .details;
input .ws .send ( `contrato start ${ contrato .value }` );

break;

case '#stamp':

output ( {

selector: '#scene-contrato',
tag: 'h3',
attributes: {

tabindex: -1

},
content: `STAMP: ${ script .details }`

} ) .focus ();

input .ws .send ( `contrato play ${ script .details }` );

break;

default:

if ( document .getElementById ( 'scene-contrato' ) )
break;

output ( {

selector: '#scenario',
html: `
<article
id="scene-contrato"
class="scene"
>

<h2>Maitre</h2>
<h3>
Started at ${ new Date () }
</h3>

</article>
`

} );

output ( {

selector: '#scene-contrato',
tag: 'input',
attributes: {

id: 'contrato',
type: 'text',
placeholder: 'Play Title'

}

} );

output ( {

selector: '#scene-contrato',
tag: 'input',
attributes: {

id: 'contrato-start',
type: 'button',
value: 'Start a New Contrato',
onclick: send

}

} );

}

};
