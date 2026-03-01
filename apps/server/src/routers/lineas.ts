import { parse } from '@std/csv'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'path'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc.js'
import getRouteColor from '../utils/getRouteColor.js'

const outputSchema = z.array(z.object({
  name: z.string(),
  color: z.string().or(z.undefined()),
  coordinates: z.array(z.array(z.number()))
}))

type Sequence = Record<'lineName' | 'lat' | 'lon' | 'sequence', string>

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ? 001 => 1 & 010 => 10
const formatLineNumber = (str: string): string => str.endsWith('0') && str.length > 2 ? str.replace(/^0+/, '') : str.replace(/^0+/, '')

const parseLineShapes = () => {
  const sortBySequence = (a: Sequence, b: Sequence) => parseInt(a.sequence) - parseInt(b.sequence)
  const coordinatesToArray = ({ lat, lon }: Sequence) => [parseFloat(lon), parseFloat(lat)]

  const filePath = path.resolve(__dirname, '../data/transit/shapes.csv')
  const content = readFileSync(filePath, { encoding: 'utf-8' })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const items = parse(
    content,
    {
      columns: ['lineName', 'lat', 'lon', 'sequence'],
      skipFirstRow: true,
      trimLeadingSpace: true
    }
  ) as Sequence[]

  const groupByLineName = Object.groupBy(items, ({ lineName }) => lineName)

  const mergeSequences = ([lineName, records]: [string, Sequence[] | undefined]): [string, number[][]] => {
    if (records === undefined) records = []
    const sortedRecords = records.sort(sortBySequence)
    const coordinates = sortedRecords.map(coordinatesToArray)
    return [lineName, coordinates]
  }

  const result = Object.entries(groupByLineName)
    .map(mergeSequences)
    .map(([key, coordinates]) => ({
      name: key,
      color: `#${getRouteColor(formatLineNumber(key.split('_')[0]))}`,
      coordinates
    }))

  return result
}

const result = parseLineShapes()

export const lineasRouter = router({
  get: publicProcedure
    .output(outputSchema)
    .query(() => {
      if (process.env.API_URL === undefined) throw new Error('Missing valid API_URL in .env file')
      return result
    })
})
