import fs from 'fs-extra';
import path from 'path';
import co from 'co';

export const command = 'init';
export const desc = 'initialize the workbench';
export const builder = {
  dir: {
    alias: 'd',
    describe: 'relative path to directory to initialise the workbench in. will create if does not exist',
    default: './',
    type: 'string'
  },
  repos: {
    alias: 'r',
    describe: 'space delimited list of repos to develop inside workbench. org/name#branch',
    default: [],
    type: 'array'
  }
}

function findOrCreateDir(dir) {
  return new Promise((res, rej) => {
    fs.ensureDir(dir, (err, data) => {
      if (err) return rej(err);
      return res(data);
    });
  });
}

function fileExists(file) {
  return new Promise((res, rej) => {
    fs.stat(file, err => {
      if (!err) return res(true);
      else if(err.code === 'ENOENT') return res(false);
      else return rej(err);
    });
  });
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
    const exists = yield fileExists(filePath);
    if (!exists) {
      yield writeConfig(filePath, repos);
    }
  });
}

export function handler(argv) {
  return co(function* () {
    const cwd = process.cwd();
    const dir = path.join(cwd, argv.dir);
    yield findOrCreateDir(dir);
    yield createFile(dir, argv.repos);

    console.log('init called for dir', dir, argv.repos)
  }).catch(console.error.bind(console));
}
