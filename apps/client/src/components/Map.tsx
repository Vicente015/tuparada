import 'maplibre-gl/dist/maplibre-gl.css'
import { layers, namedFlavor } from '@protomaps/basemaps'
import stopsJSON from '@tuparada/server/src/data/paradas.json'
import { useGeolocation } from '@uidotdev/usehooks'
// import type { FeatureCollection, LineString } from 'geojson'
import maplibregl, { type LngLatBoundsLike } from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Map as MapGL, type MapRef, Marker, type ViewStateChangeEvent } from 'react-map-gl'
// import { trpc } from '../utils/trpc'
import CircleMunicipal from './icons/CircleMunicipal'
import StopMunicipal from './icons/StopMunicipal'
import LocationButton from './LocationButton'

const MAX_BOUNDS: LngLatBoundsLike = [-15.882797, 27.723931, -15.315628, 28.195578]

const stops = stopsJSON
  .filter((item) => item.latitude !== undefined && item.longitude !== undefined)
  .map(item => ({
    ...item,
    latitude: parseFloat(item.latitude ?? '0'),
    longitude: parseFloat(item.longitude ?? '0')
  }))

function removeAllPOIs (baseLayers: maplibregl.LayerSpecification[]) {
  return baseLayers.filter(layer =>
    !layer.id?.includes('poi') &&
    !layer.id?.includes('pois')
  )
}

export default function Map () {
  const theme: 'light' | 'dark' = 'light'
  const mapRef = useRef<MapRef | null>(null)
  const [filteredStops, setFilteredStops] = useState<typeof stops>([])
  /* const { data: linesData } = trpc.lineas.get.useQuery(undefined, {
    cacheTime: 24 * 60 * 60 * 1000
  }) */
  const [zoom, setZoom] = useState(0)
  const geolocation = useGeolocation()
  const [showUserLocation, setShowUserLocation] = useState(false)

  // Get base layers and apply filter
  const baseLayers = layers('protomaps', namedFlavor('light'), { lang: 'es' })
  const filteredLayers = removeAllPOIs(baseLayers)

  /*   const geojson: FeatureCollection<LineString> = useMemo(() => ({
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
  }), [linesData]) */

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

    map.once('load', () => {

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

  useEffect(() => {
    if (showUserLocation && !geolocation.loading && geolocation.latitude != null && geolocation.longitude != null) {
      mapRef.current?.flyTo({ center: [geolocation.longitude, geolocation.latitude], zoom: 15 })
    }
  }, [showUserLocation, geolocation.loading, geolocation.latitude, geolocation.longitude])

  const handleLocate = () => {
    setShowUserLocation(true)
    if (!geolocation.loading && geolocation.latitude != null && geolocation.longitude != null) {
      mapRef.current?.flyTo({ center: [geolocation.longitude, geolocation.latitude], zoom: 15 })
    }
  }

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
    <div style={{ position: 'relative', width: '100%' }}>
    <MapGL
      ref={mapRef}
      style={{ width: '100%', height: 600 }}
      cooperativeGestures={false}
      onDragEnd={handleZoom}
      onZoomEnd={handleZoom}
      // @ts-expect-error ignore
      maxBounds={MAX_BOUNDS}
      mapStyle={{
        version: 8,
        glyphs:
          'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
        sprite: `https://protomaps.github.io/basemaps-assets/sprites/v4/${theme}`,
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
        // @ts-expect-error ignore
        layers: [
          ...filteredLayers
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
      {showUserLocation && !geolocation.loading && geolocation.latitude != null && geolocation.longitude != null && (
        <Marker
          latitude={geolocation.latitude}
          longitude={geolocation.longitude}
          anchor='center'
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#4285F4',
              border: '3px solid white',
              boxShadow: '0 0 6px rgba(66,133,244,0.5)'
            }}
          />
        </Marker>
      )}
    </MapGL>
    <div className="fixed bottom-4 right-4 z-10 md:absolute md:bottom-4 md:right-4">
      <LocationButton onLocate={handleLocate} />
    </div>
    </div>
  )
}
