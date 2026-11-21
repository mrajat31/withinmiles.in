import type { TripInput } from './types'

const REGION_KEYS = [
  'maharashtra',
  'himachal',
  'uttarakhand',
  'kashmir',
  'arunachal',
  'meghalaya',
  'goa',
  'international',
  'other',
]

const CATEGORY_MAP: Record<string, TripInput['category']> = {
  trek: 'trek',
  'road trip': 'roadtrip',
  roadtrip: 'roadtrip',
  beach: 'beach',
  adventure: 'adventure',
  weekend: 'weekend',
  pilgrimage: 'pilgrimage',
}

const SECTION_HEADS =
  /^(short description|highlights|itinerary|includes( & excludes)?|excludes|things to carry|photos)/i

function cleanBullet(line: string): string {
  return line.replace(/^[\s\-•*✓✔✕✗–]+/, '').trim()
}

/** Parse a filled TRIP-TEMPLATE text block into trip form values. */
export function parseTripTemplate(text: string): Partial<TripInput> {
  const lines = text.replace(/\r/g, '').split('\n')
  const out: Partial<TripInput> = {}
  const sections: Record<string, string[]> = {}
  let current: string | null = null

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      if (current) sections[current].push('')
      continue
    }

    const head = line.match(SECTION_HEADS)
    if (head) {
      const key = head[1].toLowerCase().startsWith('includes')
        ? 'includes'
        : head[1].toLowerCase()
      current = key
      sections[current] = sections[current] ?? []
      continue
    }

    // "Label : value" pairs (only outside multi-line sections)
    const kv = line.match(/^([A-Za-z /()]+?)\s*:\s*(.*)$/)
    if (kv && !current) {
      const label = kv[1].trim().toLowerCase()
      const value = kv[2].trim()
      if (!value) continue
      if (label.startsWith('trip name')) out.title_en = value
      else if (label === 'region') {
        const found = REGION_KEYS.find((r) => value.toLowerCase().includes(r))
        if (found) out.region = found
      } else if (label === 'category') {
        const keys = Object.keys(CATEGORY_MAP).filter((c) => value.toLowerCase().includes(c))
        const tags = [...new Set(keys.map((k) => CATEGORY_MAP[k]))]
        if (tags.length > 0) {
          out.category = tags[0]
          out.categories = tags
        }
      } else if (label.startsWith('difficulty')) {
        const v = value.toLowerCase()
        if (v.includes('begin') || v.includes('easy')) out.difficulty = 'beginner'
        else if (v.includes('advanc') || v.includes('hard') || v.includes('difficult')) out.difficulty = 'advanced'
        else if (v.includes('moder') || v.includes('medium')) out.difficulty = 'moderate'
      } else if (label.startsWith('destination')) out.destination = value
      else if (label.includes('days')) {
        const d = value.match(/(\d+)\s*d/i)
        const n = value.match(/(\d+)\s*n/i)
        if (d) out.duration_days = parseInt(d[1], 10)
        out.duration_nights = n ? parseInt(n[1], 10) : 0
      } else if (label.startsWith('price')) {
        const p = value.replace(/,/g, '').match(/(\d+)/)
        if (p) out.price = parseInt(p[1], 10)
        if (/\(|\|/.test(value)) out.price_note = value
      } else if (label.startsWith('upcoming')) out.departure_note = value
      else if (label.startsWith('best months')) out.best_months = value
      else if (label.startsWith('pickup')) out.pickup_points = value
      continue
    }

    if (current) sections[current].push(raw)
  }

  const block = (key: string) => (sections[key] ?? []).join('\n').trim()
  const list = (key: string) =>
    (sections[key] ?? [])
      .map(cleanBullet)
      .filter((l) => l && !/^\(.*\)$/.test(l))

  if (block('short description')) out.description_en = block('short description')
  if (sections['highlights']) out.highlights = list('highlights')
  if (block('itinerary')) out.itinerary = block('itinerary')
  if (sections['includes']) {
    // The combined "Includes & Excludes" section: split by ✓ / ✕ markers
    const inc: string[] = []
    const exc: string[] = []
    for (const raw of sections['includes']) {
      const line = raw.trim()
      if (!line || /^(includes|excludes)$/i.test(line)) continue
      if (/^[✕✗]/.test(line)) exc.push(cleanBullet(line))
      else if (/^[✓✔\-•*]/.test(line)) inc.push(cleanBullet(line))
      else inc.push(cleanBullet(line))
    }
    if (inc.length) out.includes = inc
    if (exc.length) out.excludes = exc
  }
  if (sections['excludes']) out.excludes = list('excludes')
  if (sections['things to carry']) out.things_to_carry = list('things to carry')

  if (!out.title_en) throw new Error('Could not find "Trip name" in the template text')
  return out
}
