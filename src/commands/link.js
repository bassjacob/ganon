import co from 'co';
import fs from 'fs-extra';
import spawn from 'buffered-spawn';
import parseConfig from '../parse-config';
import fsExists from '../lib/fsExists';
import ora from 'ora';
import path from 'path';

export const command = 'link';

export const desc = 'link the cloned repos';

export const builder = {}

export function handler(argv) {
  const config = parseConfig();
  const spinner = ora();
  spinner.text = "Linking Repositories";

  return co(function* () {
    spinner.start();
    //const results = yield config.repos.map(cloneRepo);
    //yield config.repos.map(branchAndPull);
    spinner.stop();

    //results.forEach(result => console.log(result))
  }).catch(err => {
    spinner.stop();
    console.error(err);
  });
}
