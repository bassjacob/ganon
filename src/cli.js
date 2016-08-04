#!/usr/bin/env node

/* eslint-disable global-require */

import yargs from 'yargs';

yargs.usage('Usage: $0 <command> [options]')
  .commandDir('commands')
  .demand(1)
  .help()
  .wrap(yargs.terminalWidth())
  .argv;
