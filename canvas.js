const sharp = require('sharp')

const customFont = require('./font.json')
const {
  emptySpace,
  numberWeeks,
  weekDays, fillSpace
} = require('./constants')

const createEmptyCanvasMatrix = () => {
  return new Array(weekDays).fill(null).map(() => new Array(numberWeeks).fill(emptySpace))
}

async function processImageToCanvas (imagePath) {
  const image = sharp(imagePath)
  const metadata = await image.metadata()

  if (metadata.width !== 53 || metadata.height !== 7) {
    throw new Error('The image dimensions must be 53x7 pixels.')
  }

  const { data } = await image
    .raw()
    .toBuffer({ resolveWithObject: true })

  const matrix = Array.from({ length: metadata.height }, () => [])
  for (let i = 0; i < data.length; i += metadata.channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const isWhite = r === 255 && g === 255 && b === 255
    const row = Math.floor(i / (metadata.width * metadata.channels))
    matrix[row].push(isWhite ? emptySpace : fillSpace)
  }
  return matrix
}

const processTextToCanvas = (text, spaceBetweenLetters) => {
  const toRender = text.toUpperCase()
  const canvasMatrix = createEmptyCanvasMatrix()
  let totalWidth = 0
  for (const char of toRender) {
    if (customFont[char]) {
      totalWidth += customFont[char][0].length + spaceBetweenLetters
    }
  }

  if (totalWidth > numberWeeks) {
    throw new Error('Error: Too many characters')
  }

  let columnIndex = Math.floor((numberWeeks - totalWidth) / 2)

  for (const char of toRender) {
    if (customFont[char]) {
      for (let i = 1; i < 6; i++) {
        canvasMatrix[i].splice(columnIndex, customFont[char][i - 1].length, ...customFont[char][i - 1])
      }
      columnIndex += customFont[char][0].length + spaceBetweenLetters
    }
  }
  return canvasMatrix
}

const flatByColumns = (canvasMatrix) => {
  const width = canvasMatrix.length
  const height = canvasMatrix[0].length
  const result = new Array(height * width)
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      result[i + j * width] = canvasMatrix[i][j]
    }
  }
  return result
}

const printCanvas = (canvasMatrix) => {
  for (const row of canvasMatrix) {
    console.log(row.join(''))
  }
}

module.exports = {
  createEmptyCanvasMatrix,
  processTextToCanvas,
  processImageToCanvas,
  flatByColumns,
  printCanvas
}
