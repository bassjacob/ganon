import co from 'co';
import fs from 'fs-extra';
import spawn from 'buffered-spawn';
import parseConfig from '../parse-config';
import fsExists from '../lib/fsExists';
import ora from 'ora';
import path from 'path';

const cwd = process.cwd();

export const command = 'link';
export const desc = 'link the cloned repos';
export const builder = {}

function getPackageJson({ name }) {
  const { name: module, version, dependencies, devDependencies } = require(path.join(cwd, name, 'package.json'));
  return { [name]: { module, version, dependencies, devDependencies } };
}

function shouldLink(src, target) {

}

export function handler(argv) {
  const config = parseConfig();
  const moduleToFolderPathMap = {};
  const folderPathToPackageJsonMap = {};

  const spinner = ora();
  spinner.text = "Linking Repositories";

  return co(function* () {
    spinner.start();

    const results = yield config.repos.map(getPackageJson);
    const pkgMap = Object.assign({}, ...results)
    console.log(pkgMap)

    spinner.stop();

    //results.forEach(result => console.log(result))
  }).catch(err => {
    spinner.stop();
    console.error(err);
  });
}

