import path from 'path';

function getConfigFromFile() {
  const cwd = process.cwd();
  const configPath = path.join(cwd, '.workbenchrc')
  const config = require(configPath);
}

function parseConfig(config) {
  const repos = config.repos.map((repo) => {
    const [name, branch] = repo.split('#')
    return { name, branch }
  })

  return { repos };
}

export default function config() {
  return parseConfig(getConfigFromFile())
}

