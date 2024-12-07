/* eslint-disable @typescript-eslint/no-unsafe-return */
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import { StopLines } from '../store/StopLines.js'

function loadCSV (filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  return parse(fileContent, { columns: true, skip_empty_lines: true })
}

const stopsFile = 'stops.csv'
const stopTimesFile = 'stop_times.csv'
const tripsFile = 'trips.csv'
const routesFile = 'routes.csv'

const stops = loadCSV(stopsFile) as Stops[]
const stopTimes = loadCSV(stopTimesFile) as StopTimes[]
const trips = loadCSV(tripsFile) as Trip[]
const routes = loadCSV(routesFile) as Routes[]

function getLinesByStop (stopId: string) {
  const tripIds = stopTimes
    .filter(stopTime => stopTime.stop_id === stopId)
    .map(stopTime => stopTime.trip_id)

  const routeIds = trips
    .filter(trip => tripIds.includes(trip.trip_id))
    .map(trip => trip.route_id)

  const lineNumbers = routes
    .filter(route => routeIds.includes(route.route_id))
    .map(route => route.route_short_name)

  return [...new Set(lineNumbers)]
}

function genStopLines () {
  for (const stop of stops) {
    const stopId = stop.stop_id
    StopLines.set(parseInt(stopId), getLinesByStop(stopId))
  }
}

export default genStopLines
