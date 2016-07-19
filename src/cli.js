import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const configPath = path.join(cwd, '.workbenchrc')

const config = require(configPath);

function parseRepos(config) {
  return config.repos.map((repo) => {
    const [name, branch] = repo.split('#')
    return { name, branch }
  })
}

console.log(parseRepos(config));

