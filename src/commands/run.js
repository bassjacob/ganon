import path from 'path';
import { sync } from 'glob';
import spawn from 'buffered-spawn';

function runCommand(cmd, dir) {
  const cmdArgs = cmd.split(' ');
  return spawn(cmdArgs[0], cmdArgs.slice(1), { cwd: dir })
    .then(console.log.bind(console))
    .catch(console.log.bind(console));
}

export const command = 'run';

export const desc = 'run the given command against all repositories.'
 + ' if a scope is given, run against all the match scope.';

export const builder = {
  cmd: {
    alias: 'c',
    describe: 'the command to run',
    default: 'echo "please enter a command"',
    type: 'string',
  },
  scope: {
    alias: 's',
    describe: 'the scope to run the commands against',
    default: '*',
    type: 'string',
  },
};

export function handler(argv) {
  const { cmd, scope } = argv;
  const globPath = path.join(process.cwd(), scope);
  const matched = sync(globPath);

  Promise.all(matched.map(dir => runCommand(cmd, dir)));
}
