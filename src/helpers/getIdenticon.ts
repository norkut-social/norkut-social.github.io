import Identicon from 'identicon.js'

export default function getIdenticon(str) {
  const svg = new Identicon(str, {
    format: 'svg',
    foreground: [237, 37, 144, 255],
    background: [255, 255, 255, 255]
  }).toString()
  return `data:image/svg+xml;base64,${svg}`
}
