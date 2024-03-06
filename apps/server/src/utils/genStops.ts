import { parse } from 'csv-parse/sync'
import got from 'got'
import fs from 'node:fs'
import { z } from 'zod'
import Constants from '../Constants.js'

const TRANSIT_STOPS_PATH = 'src/data/transit/stops.csv'

/**
 * Esquema de la respuesta del listado de paradas de la API
 */
const APIStopsSchema = z.array(z.object({
  nombre: z.string(),
  numero: z.string()
}))

/**
 * Esquema de UNA parada en el archivo CSV de Google Transit
 */
const TransitStopSchema = z.object({
  stop_id: z.string(),
  stop_code: z.number().optional(),
  stop_name: z.string(),
  stop_desc: z.string().optional(),
  stop_lat: z.string(),
  stop_lon: z.string(),
  zone_id: z.string().optional(),
  stop_url: z.string().optional(),
  location_type: z.string().optional(),
  parent_station: z.string().optional(),
  stop_timezone: z.string().optional(),
  wheelchair_boarding: z.string().optional()
})
const TransitStopsSchema = z.array(TransitStopSchema)

function getDataFromTransit () {
  const transitStringData = fs.readFileSync(TRANSIT_STOPS_PATH, { encoding: 'utf-8' })

  const transitStops = parse(transitStringData, {
    columns: true,
    skip_empty_lines: true
  }) as z.infer<typeof TransitStopsSchema>
  const mapTransitStop = (stop: typeof transitStops[number]) => ({
    id: parseInt(stop.stop_id),
    name: stop.stop_name,
    latitude: stop.stop_lat,
    longitude: stop.stop_lon
  })
  return transitStops.map(mapTransitStop)
}

async function getDataFromAPI () {
  const APIStopsResponse = await got.get(`${Constants.API_URL}/paradas`, {
    headers: { accept: 'application/json' },
    responseType: 'json'
  })
  return APIStopsSchema.parse(APIStopsResponse.body)
}

async function genStopsJSON () {
  let APIStops = await getDataFromAPI()
  // Eliminar el primer elemento esquema de ejemplo
  APIStops.shift()
  const nextExampleElementIndex = APIStops.findIndex((stop) => stop.numero === 'PAR')
  // Acorta la longitud del array
  APIStops = APIStops.slice(0, nextExampleElementIndex)
  const transitStops = getDataFromTransit()

  const finalData = APIStops.map(({ nombre, numero }) => {
    const stopFoundInTransit = transitStops.find(({ id }) => id === parseInt(numero))
    return {
      id: numero,
      name: nombre,
      latitude: stopFoundInTransit?.latitude,
      longitude: stopFoundInTransit?.longitude
    }
  }).sort((a, b) => parseInt(a.id) - parseInt(b.id))

  fs.writeFileSync(
    'src/data/paradas.json',
    JSON.stringify(finalData, undefined, 2)
  )
}

await genStopsJSON()
