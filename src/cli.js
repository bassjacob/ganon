import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';
import yargs from 'yargs';

import parseConfig from './cli/parse-config';
import cloneRepos from './cli/clone-repos';

const cwd = process.cwd();
const configPath = path.join(cwd, '.workbenchrc')

const config = require(configPath);
const repos = parseConfig(config);

const a = ['1', '2']

const commands = [
  require('./commands/init').default,
  require('./commands/clone').default,
  require('./commands/link').default,
  require('./commands/bootstrap').default,
  require('./commands/sweep').default,
]


const argv = yargs.usage('Usage: $0 <command> [options]');
commands.forEach(command => argv.command(...command))
argv.argv

yargs.showHelp()
