import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'

interface Route {
  route_id: string
  agency_id: string
  route_short_name: string
  route_long_name: string
  route_desc: string
  route_type: string
  route_url: string
  route_color: string
  route_text_color: string
}
type Routes = Route[]

export default function getRouteColor (code: string) {
  const routesCSV = parse(
    readFileSync('src/data/transit/routes.csv'),
    { columns: true, skip_empty_lines: true }
  ) as Routes
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const color = routesCSV.find(({ route_id }) => route_id === code)?.route_color
  return color
}
