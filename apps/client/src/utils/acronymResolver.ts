const acronyms: Record<string, string> = {
  ctra: 'carretera',
  av: 'avenida',
  'c/': 'calle',
  pl: 'plaza',
  pza: 'plaza',
  p: 'paseo',
  tr: 'teatro',
  psj: 'pasaje',
  ind: 'industria',
  pol: 'polígono',
  cc: 'centro comercial',
  ms: 'mesa',
  pso: 'paseo',
  avda: 'avenida',
  avnd: 'avenida',
  plza: 'plaza',
  'c.s': 'centro salud',
  dr: 'doctor',
  'pol. ind': 'polígono industrial',
  urb: 'urbanización',
  rtda: 'rotonda'
}

export function resolveAcronyms (input: string): string {
  return input.split(' ').map(word => {
    const lowercaseWord = word.toLowerCase().replace(/\.$/, '')
    return acronyms[lowercaseWord] || word
  }).join(' ')
}
