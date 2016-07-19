export default function parseConfig(config) {
  return config.repos.map((repo) => {
    const [name, branch] = repo.split('#')
    return { name, branch }
  })
}

