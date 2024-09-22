import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
  const routesPath = path.resolve(__dirname, '../data/transit/routes.csv')
  const routesCSV = parse(
    readFileSync(routesPath),
    { columns: true, skip_empty_lines: true }
  ) as Routes
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const color = routesCSV.find(({ route_id }) => route_id === code)?.route_color
  return color
}
