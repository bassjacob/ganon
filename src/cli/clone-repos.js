export default function cloneRepos(repos) {
  repos.forEach(({ name, branch }) => {
    spawn.sync('git' , ['clone', `git@github.com:${name}`], {stdio: 'inherit'})
  })
}

