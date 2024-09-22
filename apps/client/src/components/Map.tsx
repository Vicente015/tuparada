import 'maplibre-gl/dist/maplibre-gl.css'
import stopsJSON from '@tuparada/server/src/data/paradas.json'
import maplibregl, { type LngLatBoundsLike } from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import layers from 'protomaps-themes-base'
import { useEffect, useMemo } from 'react'
import { Map as MapGL, Marker } from 'react-map-gl'

const stops = stopsJSON
  .filter((item) => item.latitude !== undefined && item.longitude !== undefined)
  .map(item => ({
    ...item,
    latitude: parseFloat(item.latitude ?? '0'),
    longitude: parseFloat(item.longitude ?? '0')
  }))

export default function Map () {
  useEffect(() => {
    const protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)
    return () => {
      maplibregl.removeProtocol('pmtiles')
    }
  }, [])

  const theme: 'light' | 'dark' = 'light'
  const maxBounds: LngLatBoundsLike = [-15.882797, 27.723931, -15.315628, 28.195578]
  // todo: load svg inline

  const markers = useMemo(() => {
    return stops.map((stop) => (
      <Marker key={stop.id} latitude={stop.latitude} longitude={stop.longitude}>
        <a className='flex flex-row gap-1 justify-start' href={`/parada/${stop.id}`}>
          <svg viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0" transform="translate(1.5600000000000005,1.5600000000000005), scale(0.87)"><rect x="-2.4" y="-2.4" width="28.80" height="28.80" rx="7.2" fill="#0097dc" strokeWidth="0"></rect></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.22876 2 6.34315 2 5.17157 3.17157C4.10848 4.23467 4.01004 5.8857 4.00093 9H3C2.44772 9 2 9.44772 2 10V11C2 11.3148 2.14819 11.6111 2.4 11.8L4 13C4.00911 16.1143 4.10848 17.7653 5.17157 18.8284C5.41375 19.0706 5.68645 19.2627 6 19.4151V20.9999C6 21.5522 6.44772 21.9999 7 21.9999H8.5C9.05228 21.9999 9.5 21.5522 9.5 20.9999V19.9815C10.2271 20 11.0542 20 12 20C12.9458 20 13.7729 20 14.5 19.9815V20.9999C14.5 21.5522 14.9477 21.9999 15.5 21.9999H17C17.5523 21.9999 18 21.5522 18 20.9999V19.4151C18.3136 19.2627 18.5862 19.0706 18.8284 18.8284C19.8915 17.7653 19.9909 16.1143 20 13L21.6 11.8C21.8518 11.6111 22 11.3148 22 11V10C22 9.44772 21.5523 9 21 9H19.9991C19.99 5.8857 19.8915 4.23467 18.8284 3.17157C17.6569 2 15.7712 2 12 2ZM5.5 9.5C5.5 10.9142 5.5 11.6213 5.93934 12.0607C6.37868 12.5 7.08579 12.5 8.5 12.5H12H15.5C16.9142 12.5 17.6213 12.5 18.0607 12.0607C18.5 11.6213 18.5 10.9142 18.5 9.5V7C18.5 5.58579 18.5 4.87868 18.0607 4.43934C17.6213 4 16.9142 4 15.5 4H12H8.5C7.08579 4 6.37868 4 5.93934 4.43934C5.5 4.87868 5.5 5.58579 5.5 7V9.5ZM6.25 16C6.25 15.5858 6.58579 15.25 7 15.25H8.5C8.91421 15.25 9.25 15.5858 9.25 16C9.25 16.4142 8.91421 16.75 8.5 16.75H7C6.58579 16.75 6.25 16.4142 6.25 16ZM17.75 16C17.75 15.5858 17.4142 15.25 17 15.25H15.5C15.0858 15.25 14.75 15.5858 14.75 16C14.75 16.4142 15.0858 16.75 15.5 16.75H17C17.4142 16.75 17.75 16.4142 17.75 16Z" fill="#ffffff"></path> </g></svg>
        </a>
      </Marker>)
    )
  }, [stops])

  return (
      <MapGL
      style={{ width: '100%', height: 600 }}
      cooperativeGestures={false}
      maxBounds={maxBounds}
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
          },
          transition: {
            duration: 0
          },
          // @ts-expect-error wrong lib type
          layers: layers('protomaps', theme)
        }}
        // @ts-expect-error wrong lib type
        mapLib={maplibregl}
    >
      {markers}
    </MapGL>
  )
}
