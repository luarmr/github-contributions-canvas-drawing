const shell = require('shelljs')
const { formatDate } = require('./dateUtils')

const isCommitBeforeDate = async (date) => {
  const stringDate = formatDate(date)
  const commitBeforeDate = await shell
    .exec(`git log --after="${stringDate}" -1 --pretty=format:"%H"`, { silent: true })
    .stdout.trim()
  return !!commitBeforeDate
}

const createEmptyCommits = async (date, repetitions) => {
  const isoDate = date.toISOString()
  const command = (new Array(repetitions)).fill(
    `GIT_AUTHOR_DATE="${isoDate}" GIT_COMMITTER_DATE="${isoDate}" git commit --allow-empty -m "log ${isoDate}" --quiet;`
  ).join('\n')
  const result = await shell.exec(command, { silent: true })
  if (result.code !== 0) {
    throw new Error('Error: Git commit failed, Did you execute git init ?')
  }
}

module.exports = {
  isCommitBeforeDate,
  createEmptyCommits
}
