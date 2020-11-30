#!/usr/bin/env ts-node-script

import yargs from 'yargs';

yargs.commandDir('cmds').demandCommand().help().argv;
