const shell = require('shelljs')
const { formatDate } = require('./dateUtils')

const isCommitBeforeDate = (date) => {
  const stringDate = formatDate(date)
  const commitBeforeDate = shell
    .exec(`git log --after="${stringDate}" -1 --pretty=format:"%H"`, { silent: true })
    .stdout.trim()
  return !!commitBeforeDate
}

const createEmptyCommits = (date, repetitions) => {
  const isoDate = date.toISOString()
  for (let i = 0; i < repetitions; i++) {
    if (shell.exec(`GIT_AUTHOR_DATE="${isoDate}" GIT_COMMITTER_DATE="${isoDate}" git commit --allow-empty -m "log ${isoDate}" >> /dev/null`).code !== 0) {
      throw new Error(`Error: Git commit failed, Did you execute git init ?')
      `)
    }
  }
}

module.exports = {
  isCommitBeforeDate,
  createEmptyCommits
}
