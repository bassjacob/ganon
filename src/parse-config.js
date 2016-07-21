import path from 'path';

function getConfigFromFile() {
  const cwd = process.cwd();
  const configPath = path.join(cwd, '.ganonrc')

  return require(configPath);
}

export default function parseConfig() {
  const config = getConfigFromFile();
  const repos = config.repos.map((repo) => {
    const [userAndName, branch] = repo.split('#')
    const [user, name] = userAndName.split('/');
    return { name, branch, user }
  })

  return { repos };
}

