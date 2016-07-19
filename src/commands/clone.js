import co from 'co';
import fs from 'fs-extra';
import spawn from 'buffered-spawn';
import parseConfig from '../parse-config';
import fsExists from '../lib/fsExists';
import ora from 'ora';

function branchAndPull(name, branch) {
  return co(function* () {
    if (!exists) {
      yield spawn('git' , ['checkout', branch], {})
      yield spawn('git' , ['clone', `git@github.com:${user}/${name}`])
      return `Successfully cloned ${user}/${name}`;
    } else {
      return `${user}/${name} is already cloned.`;
    }
  });
}

function cloneRepo({ user, name, branch }) {
  return co(function* () {
    const exists = yield fsExists(name);
    if (!exists) {
      yield spawn('git' , ['clone', `git@github.com:${user}/${name}`])
      return `Successfully cloned ${user}/${name}`;
    } else {
      return `${user}/${name} is already cloned.`;
    }
  });
}

export const command = 'clone';

export const desc = 'clone the repos in the configuration into the workbench';

export function handler(argv) {
  const config = parseConfig();
  const spinner = ora();
  spinner.text = "Cloning Repositories";

  return co(function* () {
    spinner.start();
    const results = yield config.repos.map(cloneRepo)
    spinner.stop();

    results.forEach(result => console.log(result))
  }).catch(err => {
    spinner.stop();
    console.error(err);
  });
}
