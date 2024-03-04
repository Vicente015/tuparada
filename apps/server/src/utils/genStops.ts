import { parse } from 'csv-parse/sync'
import fs from 'node:fs'

const googleTransitPath = (fileName: string) => `src/data/transit/${fileName}.csv`

interface Stop {
  stop_id: string
  stop_code: number | undefined
  stop_name: string
  stop_desc: string | undefined
  stop_lat: string
  stop_lon: string
  zone_id: string | undefined
  stop_url: string | undefined
  location_type: string | undefined
  parent_station: string | undefined
  stop_timezone: string | undefined
  wheelchair_boarding: string | undefined
}
type Stops = Stop[]

function genStopsJSON () {
  // todo: sacar paradas de la api oficial porque así tienen menos acrónimos y nombres actualizados
  const TRANSIT_STOPS_PATH = googleTransitPath('stops')
  const transitStringData = fs.readFileSync(TRANSIT_STOPS_PATH, { encoding: 'utf-8' })
  const mapStop = (stop: Stop) => ({
    id: parseInt(stop.stop_id),
    name: stop.stop_name,
    latitude: stop.stop_lat,
    longitude: stop.stop_lon
  })

  const transitCSVData = parse(transitStringData, {
    columns: true,
    skip_empty_lines: true
  }) as Stops
  const mappedData = transitCSVData
    .map(mapStop)
    .sort(((a, b) => a.id - b.id))

  fs.writeFileSync(
    'src/data/paradas.json',
    JSON.stringify(mappedData, undefined, 2)
  )
}

export default genStopsJSON
