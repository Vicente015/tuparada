/* eslint-disable no-useless-escape */
const abbreviations = {
  ctra: 'carretera',
  'c/': 'calle',
  av: 'avenida',
  avda: 'avenida',
  avnd: 'avenida',
  pl: 'plaza',
  plza: 'plaza',
  cc: 'centro comercial',
  'c.s': 'centro salud',
  dr: 'doctor',
  ind: 'industrial',
  'pol. ind': 'polígono industrial',
  urb: 'urbanización',
  rtda: 'rotonda'
}

function removeAbbvInName (name: string) {
  let result
  for (const [abbv, value] of Object.entries(abbreviations)) {
    result = name.replaceAll(new RegExp(abbv.toUpperCase(), 'g'), value.toUpperCase())
  }
  return result
}

export default function normalizeAbbreviations (name: string) {
  let result = name
  result = name.split(' ').map((word) => removeAbbvInName(word)).join(' ')
  if (name !== result) console.debug('changed', result, name)
  return result
}
