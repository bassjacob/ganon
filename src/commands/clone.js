/* eslint-disable no-console */
import ora from 'ora';
import path from 'path';
import co from 'co';
import fs from 'fs-extra';
import spawn from 'buffered-spawn';
import parseConfig from '../parse-config';
import fsExists from '../lib/fsExists';

const workDir = process.cwd();

function branchAndPull({ user, name, branch }) {
  return co(function* branchHandler() {
    yield spawn('git', ['checkout', branch], { cwd: path.join(workDir, name) });
    yield spawn('git', ['pull'], { cwd: path.join(workDir, name) });
    return `Successfully pulled latest ${user}/${name}#${branch}`;
  });
}

function cloneRepo({ user, name }) {
  return co(function* cloneHandler() {
    const exists = yield fsExists(name);
    if (!exists) {
      yield spawn('git', ['clone', `git@github.com:${user}/${name}`], { cwd: workDir });
      return `Successfully cloned ${user}/${name}`;
    }

    return `${user}/${name} is already cloned.`;
  });
}

export const command = 'clone';

export const desc = 'clone the repos in the configuration into the ganon';

export const builder = {};

export function handler() {
  const config = parseConfig();
  const spinner = ora();
  spinner.text = 'Cloning Repositories';

  return co(function* mainHandler() {
    spinner.start();
    fs.ensureDirSync(workDir);
    const results = yield config.repos.map(cloneRepo);
    yield config.repos.map(branchAndPull);
    spinner.stop();

    results.forEach(result => console.log(result));
  }).catch(err => {
    spinner.stop();
    console.error(err);
  });
}
