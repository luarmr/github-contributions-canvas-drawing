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

const removeOldCommits = async (finalDate) => {
  try {
    const commitAfterFinalDate = await shell
      .exec(`git log --before="${finalDate}" -1 --pretty=format:"%H"`, { silent: true })
      .stdout.trim()
    if (!commitAfterFinalDate) {
      throw new Error('No commits found after the specified date.')
    }

    const numberOfCommits = await shell
      .exec(`git rev-list --count "${commitAfterFinalDate}..HEAD"`, { silent: true })
      .stdout.trim()
    await shell.exec(`git reset --hard "HEAD~${numberOfCommits}"`, { silent: true })

    return 'Commits older than the specified date have been removed.'
  } catch (error) {
    throw new Error(`Failed to remove commits: ${error.message}`)
  }
}

module.exports = {
  isCommitBeforeDate,
  createEmptyCommits,
  removeOldCommits
}
