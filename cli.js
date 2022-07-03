#!/usr/bin/env node

import Maitre from './index.js';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const { argv } = yargs ( hideBin ( process.argv ) );
const maitre = new Maitre ();

maitre .on ( 'error', error => console .error ( '#maitre', '#error:', error ) );

const port = typeof argv .port === 'number' ? argv .port : 1313;

maitre .listen ( port, () => console .log ( '#maitre', '#listening', '#port', port, Date () ) );
