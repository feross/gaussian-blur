var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

const SIZE = 500
const BLUR_SIZE = 5
console.log('BLUR_SIZE:', BLUR_SIZE)

const BLUR_PIXELS = Math.pow(1 + (BLUR_SIZE * 2), 2)

canvas.width = SIZE
canvas.height = SIZE

let img = new window.Image()
img.addEventListener('load', () => {
  ctx.drawImage(img, 0, 0)
  let { data: input } = ctx.getImageData(0, 0, SIZE, SIZE)

  let output = new Uint8ClampedArray(input.length)

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const outputPixel = [0, 0, 0, 0]
      for (let k = -1 * BLUR_SIZE; k <= BLUR_SIZE; k++) {
        for (let l = -1 * BLUR_SIZE; l <= BLUR_SIZE; l++) {
          const p = getPixel(input, i + k, j + l)
          outputPixel[0] += p[0] / BLUR_PIXELS
          outputPixel[1] += p[1] / BLUR_PIXELS
          outputPixel[2] += p[2] / BLUR_PIXELS
          outputPixel[3] += p[3] / BLUR_PIXELS
        }
      }
      const startIndex = getPixelStart(i, j)
      output[startIndex + 0] = outputPixel[0]
      output[startIndex + 1] = outputPixel[1]
      output[startIndex + 2] = outputPixel[2]
      output[startIndex + 3] = outputPixel[3]
    }
  }
  const finalImageData = new window.ImageData(output, SIZE, SIZE)
  ctx.putImageData(finalImageData, 0, 0)
})
img.src = './checker.png'

function getPixelStart (x, y) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return [255, 255, 255, 255]
  return (x * 4) + (y * SIZE * 4)
}

function getPixel (arr, x, y) {
  const startIndex = getPixelStart(x, y)
  return arr.slice(startIndex, startIndex + 4)
}
