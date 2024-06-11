const minimist = require('minimist')
const ProgressBar = require('progress')
const fetchContributions = require('./utils/contributions')
const { numberWeeks, fillSpace } = require('./utils/constants')
const { getFirstSundayOfYear, formatDate, firstSundayDaysAgo } = require('./utils/dateUtils')
const canvas = require('./utils/canvas')
const { removeOldCommits, isCommitBeforeDate, createEmptyCommits } = require('./utils/gitUtils')

const parseArgs = () => {
  const args = minimist(process.argv.slice(2), {
    default: {
      text: '',
      'image-path': '',
      'min-commits': 1,
      'max-commits': 30,
      'space-between-letters': 1,
      'dry-run': false,
      force: false
    },
    boolean: ['dry-run', 'help', 'force'],
    alias: {
      t: 'text',
      i: 'image-path',
      mc: 'min-commits',
      xc: 'max-commits',
      y: 'year',
      s: 'space-between-letters',
      u: 'user',
      h: 'help',
      f: 'force'
    }
  })

  const text = args.text
  const imagePath = args['image-path']
  const noInputProvided = !text && !imagePath
  if (args.help || noInputProvided) {
    console.log(`
  Usage: node app.js [options, text or image-path is required]

Options:
  --help, -h                   Show this help message and exit
  --text, -t <string>          The text that should be rendered (text or image-path is required)
  --image-path, -i <string>    Path to an image (7 pixels height, 53 pixels width) (text or image-path is required)
  --min-commits, --mc <number> Minimum number of commits (default: 1)
  --max-commits, --xc <number> Maximum number of commits (default: 30)
  --year, -y <number>          Year (default: current year)
  --space-between-letters, -s  <number> Space between letters (default: 1, valid: 0-7)
  --user, -u <string>          GitHub username to check for existing contributions (in beta)
  --dry-run                    Test mode (default: false)
  --force, -f                  Force remove commits older than the initial date
  `)
    process.exit(args.help ? 0 : 1)
  }

  const year = args.year
  const initialDate = year ? getFirstSundayOfYear(year) : firstSundayDaysAgo(365)
  const endDate = year ? new Date(year, 11, 31, 12, 0, 0) : new Date()
  const minCommits = args['min-commits']
  const maxCommits = args['max-commits']
  const spaceBetweenLetters = args['space-between-letters']
  const user = args.user
  const test = args['dry-run']
  const force = args.force

  return {
    text,
    imagePath,
    minCommits,
    maxCommits,
    spaceBetweenLetters,
    test,
    initialDate,
    endDate,
    user,
    force
  }
}

const {
  text,
  imagePath,
  minCommits,
  maxCommits,
  initialDate,
  endDate,
  user,
  spaceBetweenLetters,
  test,
  force
} = parseArgs()

const main = async () => {
  try {
    if (force) {
      console.log(await removeOldCommits(formatDate(initialDate)))
    } else if (await isCommitBeforeDate(initialDate)) {
      throw new Error(`I am sorry, you need to remove the commits after ${formatDate(initialDate)}. You can use the --force parameter to do this automatically.`)
    }

    const canvasMatrix = text
      ? canvas.processTextToCanvas(text, spaceBetweenLetters)
      : await canvas.processImageToCanvas(imagePath)

    canvas.printCanvas(canvasMatrix)

    if (test) {
      console.log('You are only previewing with --dry-run')
      process.exit(1)
    }

    const flatCanvas = canvas.flatByColumns(canvasMatrix)

    const progressBar = new ProgressBar('[:bar] :percent :etas', {
      total: flatCanvas.length,
      width: numberWeeks,
      complete: '=',
      incomplete: ' '
    })

    let existingContributions = {}

    if (user) {
      console.warn('Parameter "user" is set. Note that commits made in other repositories will be accounted for in their contribution graph to calculate the number of commits that have to be created. This is in BETA since I am not sure how to account for the default timezone in GitHub.')
      const initialYear = initialDate.getFullYear()
      const finalYear = endDate.getFullYear()
      existingContributions = await fetchContributions(user, initialYear)
      if (initialYear !== finalYear) {
        const moreContributions = await fetchContributions(user, finalYear)
        existingContributions = { ...existingContributions, ...moreContributions }
      }
    }

    const iterationDate = new Date(initialDate.getTime())
    for (let i = 0; i < flatCanvas.length; i++) {
      if (iterationDate <= endDate) {
        const numCommitsNeeded = flatCanvas[i] === fillSpace ? maxCommits : minCommits
        const existingContributionsCount = existingContributions[formatDate(iterationDate)] || 0
        const numCommits = numCommitsNeeded - existingContributionsCount
        if (numCommits > 0) {
          await createEmptyCommits(iterationDate, numCommits)
        }
      }
      progressBar.tick()
      iterationDate.setDate(iterationDate.getDate() + 1)
    }
    progressBar.terminate()

    console.log(`
    Now you can push this to GitHub. Assuming your project is empty, you can do:
    git branch -M main
    git remote add origin git@github.com:<user_name>/<project_name>.git
    git push -u origin main
    
    HAVE FUN! BE KIND!`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
