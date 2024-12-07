import 'maplibre-gl/dist/maplibre-gl.css'
import stopsJSON from '@tuparada/server/src/data/paradas.json'
import type { FeatureCollection, LineString } from 'geojson'
import maplibregl, { type LngLatBoundsLike } from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import layers from 'protomaps-themes-base'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Map as MapGL, type MapRef, Marker, type ViewStateChangeEvent } from 'react-map-gl'
import { trpc } from '../utils/trpc'
import CircleMunicipal from './icons/CircleMunicipal'
import StopMunicipal from './icons/StopMunicipal'

const MAX_BOUNDS: LngLatBoundsLike = [-15.882797, 27.723931, -15.315628, 28.195578]

const stops = stopsJSON
  .filter((item) => item.latitude !== undefined && item.longitude !== undefined)
  .map(item => ({
    ...item,
    latitude: parseFloat(item.latitude ?? '0'),
    longitude: parseFloat(item.longitude ?? '0')
  }))

export default function Map () {
  const theme: 'light' | 'dark' = 'light'
  const mapRef = useRef<MapRef | null>(null)
  const [filteredStops, setFilteredStops] = useState<typeof stops>([])
  const { data: linesData } = trpc.lineas.get.useQuery(undefined, {
    cacheTime: 24 * 60 * 60 * 1000
  })
  const [zoom, setZoom] = useState(0)

  const geojson: FeatureCollection<LineString> = useMemo(() => ({
    type: 'FeatureCollection',
    features: (linesData ?? []).map((line) => ({
      id: 'lines-map-data-element',
      type: 'Feature',
      properties: { color: line.color, name: line.name },
      geometry: {
        type: 'LineString',
        coordinates: line.coordinates
      }
    }))
  }), [linesData])

  useEffect(() => {
    const protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)
    return () => {
      maplibregl.removeProtocol('pmtiles')
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (map === null) return

    map.once('load', (ev) => {

    })
  }, [mapRef.current])

  const markers = useMemo(() => {
    const size = zoom < 14 ? 8 : Math.floor((zoom - 12) * 8)
    console.debug('size', size)
    return filteredStops.map((stop) => (
      <Marker
        key={stop.id}
        latitude={stop.latitude}
        longitude={stop.longitude}
        anchor='bottom'
      >
        <a href={`/parada/${stop.id}`}>
          {zoom < 14
            ? <CircleMunicipal width={size} height={size} />
            : <StopMunicipal width={size} height={size} />}
        </a>
      </Marker>
    )
    )
  }, [filteredStops, zoom])

  const handleZoom = (e: ViewStateChangeEvent) => {
    const { zoom: newZoom } = e.viewState
    console.debug('newZoom', newZoom)
    setZoom(newZoom)
    const bounds = mapRef.current?.getBounds()

    if (newZoom < 12) {
      setFilteredStops([])
      return
    }

    setFilteredStops(
      stops.filter((stop) => bounds?.contains([stop.longitude, stop.latitude]))
    )
  }

  return (
    <MapGL
      ref={mapRef}
      style={{ width: '100%', height: 600 }}
      cooperativeGestures={false}
      onDragEnd={handleZoom}
      onZoomEnd={handleZoom}
      maxBounds={MAX_BOUNDS}
      mapStyle={{
        version: 8,
        glyphs:
          'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
        sprite: `https://protomaps.github.io/basemaps-assets/sprites/v3/${theme}`,
        sources: {
          protomaps: {
            type: 'vector',
            url: 'https://mapa.vicente015.dev/grancanaria.json'
          }
          /*           lines: {
            type: 'geojson',
            data: geojson
          } */
        },
        transition: {
          duration: 0
        },
        // @ts-expect-error ignore pls
        layers: [...layers('protomaps', theme)
          /*           {
            id: 'lines-fill',
            type: 'line',
            source: 'lines',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': 'white', // Red color
              'line-width': 6, // Width of the line
              'line-opacity': 1 // Full opacity
            }
          },
          {
            id: 'lines-outline',
            type: 'line',
            source: 'lines',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': ['get', 'color'], // White color for outline
              'line-width': 2 // Slightly thicker for outline
            }
          } */
        ]
      }}
      // @ts-expect-error wrong lib type
      mapLib={maplibregl}
    >
      {markers}
    </MapGL>
  )
}
