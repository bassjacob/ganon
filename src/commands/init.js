import fs from 'fs-extra';
import path from 'path';
import co from 'co';
import fsExists from '../lib/fsExists';

export const command = 'init';
export const desc = 'initialize the workbench';
export const builder = {
  repos: {
    alias: 'r',
    describe: 'space delimited list of repos to develop inside workbench. org/name#branch',
    default: [],
    type: 'array'
  }
}

function writeConfig(file, repos) {
  const contents = `module.exports = ${JSON.stringify({ repos }, null, 2)}`;
  return new Promise((res, rej) => {
    fs.writeFile(file, contents, err => {
      if (err) return rej(err);
      return res();
    });
  });
}

function createFile(dir, repos) {
  const filePath = path.join(dir, '.workbenchrc');

  return co(function* () {
    const exists = yield fsExists(filePath);
    if (!exists) {
      yield writeConfig(filePath, repos);
    }
  });
}

export function handler(argv) {
  return co(function* () {
    const cwd = process.cwd();
    yield createFile(cwd, argv.repos);
  }).catch(console.error.bind(console));
}
