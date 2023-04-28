const minimist = require('minimist')
const shell = require('shelljs')
const ProgressBar = require('progress')

const customFont = require('./font.json')

const numberWeeks = 53
const weekDays = 7

const emptySpace = ' '
const fillSpace = '#'

const getFirstSundayOfYear = (year) => {
  const firstDay = new Date(year, 0, 1) // Month is 0-indexed
  const dayOfWeek = firstDay.getDay() // 0 is Sunday
  const daysToAdd = dayOfWeek === 0 ? 0 : (7 - dayOfWeek)
  return new Date(year, 0, 1 + daysToAdd)
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function firstSundayDaysAgo (daysAgo) {
  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setDate(pastDate.getDate() - daysAgo)

  while (pastDate.getDay() !== 0) {
    pastDate.setDate(pastDate.getDate() - 1)
  }

  return pastDate
}

const displayHelp = () => {
  const helpText = `
Usage: node app.js <text-to-render|dot2pic.com array> [options]

Options:
  --help, -h                  Show this help message and exit
  --min-commits, -mc <number> Minimum number of commits (default: 1)
  --max-commits, -xc <number> Maximum number of commits (default: 40)
  --year, -y <number>         Year (default: current year)
  --space-between-letters, -s <number> Space between letters (default: 1, valid: 0-7)
  --test, -t                  Test mode (default: false)
`
  console.log(helpText)
}

const parseArgs = () => {
  const args = minimist(process.argv.slice(2), {
    default: {
      'min-commits': 1,
      'max-commits': 40,
      'space-between-letters': 1,
      test: false
    },
    boolean: ['test', 'help'],
    alias: {
      mc: 'min-commits',
      xc: 'max-commits',
      y: 'year',
      s: 'space-between-letters',
      t: 'test',
      h: 'help'
    }
  })

  if (args.help || args._.length < 1) {
    displayHelp()
    process.exit(args.help ? 0 : 1)
  }

  const year = args.year
  const initialDate = year ? getFirstSundayOfYear(year) : firstSundayDaysAgo(365)
  const endDate = year ? new Date(year, 11, 31) : new Date()
  let toRender = args._[0].toUpperCase()

  // I have to check if is a string or a serialization of a picture. dot2pic
  // The magic number, I just got a valid string and I check
  if (toRender.length === 1856 && toRender[0] === '{' && toRender[1855] === '}') {
    toRender.slice(1, -1)
    let posibleArray = toRender.split(',')
    if (posibleArray.length === numberWeeks * weekDays) {
      posibleArray = posibleArray.map((pixel) => pixel === '0X00' ? emptySpace : fillSpace)
      toRender = []
      // this convert and 1 dimensional array in bidimensional 53x7
      while (posibleArray.length > 0) {
        toRender.push(posibleArray.splice(0, numberWeeks))
      }
    }
  }

  const minCommits = args['min-commits']
  const maxCommits = args['max-commits']
  const spaceBetweenLetters = args['space-between-letters']
  const test = args.test

  return {
    toRender,
    minCommits,
    maxCommits,
    spaceBetweenLetters,
    test,
    initialDate,
    endDate
  }
}

const {
  toRender,
  minCommits,
  maxCommits,
  initialDate,
  endDate,
  spaceBetweenLetters,
  test
} = parseArgs()

const processText = !Array.isArray(toRender)
const canvasMatrix = processText
  ? new Array(7).fill(null).map(() => new Array(numberWeeks).fill(emptySpace))
  : toRender

// At this point we can have a text or a valid canvas, if we have text we will fill the empty canvas
if (processText) {
  let totalWidth = 0
  for (const char of toRender) {
    if (customFont[char]) { // IN CASE I MOVE FROM MONOSPACE :)
      totalWidth += customFont[char][0].length + spaceBetweenLetters
    }
  }

  if (totalWidth > numberWeeks) {
    throw new Error('Error: Too many characters')
  }

  let columnIndex = Math.floor((numberWeeks - totalWidth) / 2)

  for (const char of toRender) {
    if (customFont[char]) {
      for (let i = 1; i < 6; i++) { // decided to print only 5 lines, mostly aesthetics. So I discard top and bottom
        canvasMatrix[i].splice(columnIndex, customFont[char][i - 1].length, ...customFont[char][i - 1])
      }
      columnIndex += customFont[char][0].length + spaceBetweenLetters
    }
  }
}
for (const row of canvasMatrix) {
  console.log(row.join(''))
}

if (test) {
  console.log('You are only previewing')
  process.exit(1)
}

const iterationDate = new Date(initialDate.getTime())
iterationDate.setHours(1, 0, 0, 0)

const totalIterations = numberWeeks * weekDays

const progressBar = new ProgressBar('[:bar] :percent :etas', {
  total: totalIterations,
  width: numberWeeks,
  complete: '=',
  incomplete: ' '
})

const commitBeforeDate = shell
  .exec(`git log --after="${formatDate(initialDate)}" -1 --pretty=format:"%H"`, { silent: true })
  .stdout.trim()

if (commitBeforeDate) {
  console.log(`I am sorry, you need to remove the commits after ${formatDate(initialDate)} you can use the sh tool in this repo`)
  process.exit()
}

for (let i = 0; i < numberWeeks; i++) {
  for (let j = 0; j < weekDays; j++) {
    if (iterationDate <= endDate) {
      const cell = canvasMatrix[j][i]
      const isoDate = iterationDate.toISOString()
      const repetitions = cell === fillSpace ? maxCommits : minCommits
      for (let k = 0; k < repetitions; k++) {
        if (shell.exec(`GIT_AUTHOR_DATE="${isoDate}" GIT_COMMITTER_DATE="${isoDate}" git commit --allow-empty -m "log ${isoDate}" >> /dev/null`).code !== 0) {
          console.log('\n\n')
          console.error('Error: Git commit failed')
          console.error('Did you create a repository in GitHub? (I recommend to set is as private)')
          console.error('Did you execute git init ?')
          process.exit(1)
        }
      }
      iterationDate.setDate(iterationDate.getDate() + 1)
      progressBar.tick()
    }
  }
}
progressBar.terminate()

console.log(`
Now you can push this to GitHub. Assuming you project is empty you can do:
git branch -M main
git remote add origin git@github.com:<user_name>/<project_name>.git
git push -u origin main

HAVE FUN! BE KIND!
`)
