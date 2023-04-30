const minimist = require('minimist')
const ProgressBar = require('progress')

const {
  numberWeeks,
  fillSpace
} = require('./constants')

const { getFirstSundayOfYear, formatDate, firstSundayDaysAgo } = require('./dateUtils')
const canvas = require('./canvas')
const { isCommitBeforeDate, createEmptyCommits } = require('./gitCommands')

const parseArgs = () => {
  const args = minimist(process.argv.slice(2), {
    default: {
      text: '',
      'image-path': '',
      'min-commits': 1,
      'max-commits': 30,
      'space-between-letters': 1,
      'dry-run': false
    },
    boolean: ['dry-run', 'help'],
    alias: {
      t: 'text',
      i: 'image-path',
      mc: 'min-commits',
      xc: 'max-commits',
      y: 'year',
      s: 'space-between-letters',
      h: 'help'
    }
  })

  const text = args.text
  const imagePath = args['image-path']
  const noInputProvided = !text && !imagePath
  if (args.help || noInputProvided) {
    console.log(`
Usage: node app.js [options]

Options:
  --help, -h                   Show this help message and exit
  --text, -t <string>          The text that should be render (text or image-path is required)
  --image-path, -i <string>    Path to an image 7 pixel height 53 width (text or image-path
                               is required)
  --min-commits, --mc <number> Minimum number of commits (default: 1)
  --max-commits, --xc <number> Maximum number of commits (default: 30)
  --year, -y <number>          Year (default: current year)
  --space-between-letters, -s  <number> Space between letters (default: 1, valid: 0-7)
  --dry-run                    Test mode (default: false)`
    )
    process.exit(args.help ? 0 : 1)
  }

  const year = args.year
  const initialDate = year ? getFirstSundayOfYear(year) : firstSundayDaysAgo(365)
  const endDate = year ? new Date(year, 11, 31) : new Date()
  const minCommits = args['min-commits']
  const maxCommits = args['max-commits']
  const spaceBetweenLetters = args['space-between-letters']
  const test = args['dry-run']

  return {
    text,
    imagePath,
    minCommits,
    maxCommits,
    spaceBetweenLetters,
    test,
    initialDate,
    endDate
  }
}

const {
  text,
  imagePath,
  minCommits,
  maxCommits,
  initialDate,
  endDate,
  spaceBetweenLetters,
  test
} = parseArgs()

const main = async () => {
  const canvasMatrix = text
    ? canvas.processTextToCanvas(text, spaceBetweenLetters)
    : await canvas.processImageToCanvas(imagePath)

  canvas.printCanvas(canvasMatrix)

  if (test) {
    console.log('You are only previewing wyr --dry-run')
    process.exit(1)
  }

  const flatCanvas = canvas.flatByColumns(canvasMatrix)

  const progressBar = new ProgressBar('[:bar] :percent :etas', {
    total: flatCanvas.length,
    width: numberWeeks,
    complete: '=',
    incomplete: ' '
  })

  if (isCommitBeforeDate(initialDate)) {
    throw new Error(`I am sorry, you need to remove the commits after ${formatDate(initialDate)} you can use the sh tool in this repo`)
  }
  const iterationDate = new Date(initialDate.getTime())
  for (let i = 0; i < flatCanvas.length; i++) {
    if (iterationDate <= endDate) {
      createEmptyCommits(iterationDate, flatCanvas[i] === fillSpace ? maxCommits : minCommits)
      iterationDate.setDate(iterationDate.getDate() + 1)
      progressBar.tick()
    }
  }
  progressBar.terminate()

  console.log(`
Now you can push this to GitHub. Assuming you project is empty you can do:
git branch -M main
git remote add origin git@github.com:<user_name>/<project_name>.git
git push -u origin main

HAVE FUN! BE KIND!`
  )
}

main()
