import co from 'co';
import fs from 'fs-extra';
import spawn from 'buffered-spawn';
import parseConfig from '../parse-config';
import fsExists from '../lib/fsExists';
import ora from 'ora';
import path from 'path';
import semver from 'semver';

import { isObject, map, mapValues, reduce, forEach } from 'lodash';

const cwd = process.cwd();

export const command = 'link';
export const desc = 'link the cloned repos';
export const builder = {}

function installDependencies(repo) {
  return co(function* () {
    yield spawn('npm' , ['install'], { cwd: path.join(cwd, repo) })
  });
}

function flattenDependencies(repo) {
  return co(function* () {
    yield spawn('npm' , ['dedupe'], { cwd: path.join(cwd, repo) })
  });
}

function runPrePublish(folder) {
  return co(function* () {
    yield spawn('npm' , ['run', 'prepublish'], { cwd: folder })
  });
}

function getPackageJson({ name }) {
  const pkg = require(path.join(cwd, name, 'package.json'));
  return { [name]: pkg };
}

function shouldLink({ name, version }, { dependencies, devDependencies }) {
  const dep = (dependencies && dependencies[name]) || (devDependencies && devDependencies[name]);
  if (!dep) return false;

  return semver.satisfies(version, dep);
}

function pkgjson({ name, version }) {
  return JSON.stringify({ name, version })
}

function placeholderBin(bin, name, modPath) {
  if (isObject(bin)) {
    return map(bin, (v, k) => ({ name: k, path: path.join(modPath, v) }));
  }

  if (name.indexOf('/')) {
    name = name.split('/')[1];
  }

  return [{ name, path: path.join(modPath, bin) }];
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

    const linkables = mapValues(pkgMap, a => {
      const toLink = reduce(pkgMap, (result, v, k) => {
        if (v === a) return result;
        if (!shouldLink(a,v)) return result;
        result.push(k)
        return result;
      }, [])

      return {
        name: a.name,
        version: a.version,
        bin: a.bin,
        targets: toLink
      }
    });

    // forEach(linkables, (v, k) => {
    //   forEach(v.targets, r => fs.copy(path.join(cwd, k, 'package.json'), path.join(cwd, r, `node_modules/${v.name}/package.json`)))
    // })

    // yield map(config.repos, ({name}) => installDependencies(name))

    // forEach(linkables, (v, k) => {
    //   forEach(v.targets, r => {
    //     fs.copy(path.join(cwd, k, 'node_modules'), path.join(cwd, r, `node_modules/${v.name}/node_modules`))
    //     require('glob').sync(path.join(cwd, k, '!(node_modules|.git)')).forEach(f => {
    //       const newFile = f.replace(k, path.join(r, 'node_modules', v.name))
    //       fs.ensureSymlinkSync(f, newFile)
    //     })
    //   })
    // })

    // yield map(linkables, (k, {name, scripts}) => scripts && scripts.prepublish && runPrePublish(path.join(cwd, r, `node_modules/${name}`)))

    spinner.stop();
    forEach(linkables, (v, k) => {
      forEach(v.targets, r => {
        require('glob').sync(path.join(cwd, k, '!(node_modules|.git)')).forEach(f => {
          const newFile = f.replace(k, path.join(r, 'node_modules', v.name))
          fs.ensureSymlinkSync(f, newFile)
        })
        placeholderBin(v.bin || {}, v.name, path.join(cwd, k)).map(a => {
          const target = path.join(cwd, r, 'node_modules/.bin', a.name)
          fs.ensureSymlinkSync(a.path, target)
        })
      })
    })

  }).catch(err => {
    spinner.stop();
    console.error(err);
  });
}

