#!/usr/bin/env node

import yargs from 'yargs';

const commands = [
  './commands/init',
  './commands/clone',
  './commands/link',
  './commands/bootstrap',
  './commands/sweep',
].map(command => require(command).default)

const argv = yargs.usage('Usage: $0 <command> [options]')
                  .commandDir('commands')
                  .demand(1)
                  .help()
                  .wrap(yargs.terminalWidth())
                  .argv;
