import 'leaflet/dist/leaflet.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { getLatitude, getLongitude } from 'geolib'
import type { GeolibInputCoordinates } from 'geolib/es/types'
import { Bounds, Icon, latLng, latLngBounds, rectangle } from 'leaflet'
import { type DependencyList, useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import Skeleton from 'react-loading-skeleton'
import stops from '../../../server/src/data/paradas.json'
import { getMapData } from '../hooks/getMapData'
import LocationButton from './LocationButton'

const coordinates = stops
  .filter((item) => item.latitude !== undefined && item.longitude !== undefined)
  .map(item => ({
    ...item,
    latitude: parseFloat(item.latitude ?? '0'),
    longitude: parseFloat(item.longitude ?? '0')
  }))

const Map: React.FC = () => {
  const { mapData, numClick, openMap, setMapState, userCoords } = getMapData()
  const [Zoom, setZoomHook] = useState(15)
  const [loadedStops, setLoadedStops] = useState<any[]>() // change any to type
  const [loading, setLoading] = useState(true)
  const [centerUser, setCenterUser] = useState(false)
  const defaultData = [{ id: '000', latitude: 0, longitude: 0, name: 'DONT LOOK HERE' }]

  const PointMarker = ({ center, icon, id, name }: any) => {
    const map = useMap()
    const corner1 = latLng(28.300640, -15.716717) // todo: change to use userCoords as reference (or not)
    const corner2 = latLng(27.889199, -15.144883)
    const bounds = latLngBounds(corner1, corner2)
    map.setMaxBounds(bounds)
    map.setMinZoom(10)

    return (
      <Marker position={center} icon={icon !== undefined ? icon : errorIcon}>
        {name
          ? <Popup>
            <a className='p-1 flex flex-row gap-2 items-center' href={`/parada/${id}`}>
              <span className="min-w-[3.5ch] h-fit text-center p-[0.1rem] bg-neutral-300 font-mono text-sm rounded-sm">{id}</span>
              <p className='w-auto h-auto break-words text-base !my-0'>{name.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)).join(' ')}</p>
            </a>
          </Popup>
          : <></>
        }
      </Marker>
    )
  }

  const MyMarkers = ({ data }: any) => {
    return data.map((item: any, index: any) => (
      <PointMarker
        key={index} // pls dont break
        name={item.name}
        id={item.id}
        center={{ lat: item.latitude, lng: item.longitude }}
        icon={busStopIcon}
      />
    ))
  }

  const UserMarker = ({ coords }: any) => {
    return (
      <PointMarker
        center={{ lat: coords.latitude, lng: coords.longitude }}
        icon={mapIcon}
      />
    )
  }

  const GetMapData = () => {
    const map = useMap()
    let stopsInView: Array<{ latitude: number, longitude: number, id: string, name: string }> = []

    useMapEvents({
      zoomend () { // zoom event (when zoom animation ended)
        const zoom = map.getZoom() // get current Zoom of map
        const bounds = map.getBounds()
        stopsInView = []
        setZoomHook(zoom)

        for (const item of coordinates) {
          if (bounds.contains([item.latitude, item.longitude]) && map.getZoom() >= 16) {
            stopsInView.push(item)
          }
        }
        updateLoadedStops(stopsInView)
      },
      dragend () {
        const bounds = map.getBounds()
        stopsInView = []

        for (const item of coordinates) {
          if (bounds.contains([item.latitude, item.longitude]) && map.getZoom() >= 16) {
            stopsInView.push(item)
          }
        }

        updateLoadedStops(stopsInView)
      }
    })

    useEffect(() => {
      if (centerUser && getLatitude(userCoords!) !== 0) {
        map.flyTo([getLatitude(userCoords!), getLongitude(userCoords!)], 16)
        setCenterUser(false)
      }
      setCenterUser(false)
    }, [numClick])

    return null
  }

  const updateLoadedStops = (coords: typeof coordinates) => {
    const uniqueNewElements = coords.filter((element) => !loadedStops!.includes(element))
    const updatedStops = [...loadedStops!, ...uniqueNewElements]

    setLoadedStops(updatedStops)
  }

  useEffect(() => {
    setCenterUser(true)
    setLoadedStops(defaultData)
  }, [numClick])

  useEffect(() => { // ( ͡° ͜ʖ ͡°)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const mapIcon = new Icon({
    iconUrl: '/circle-user.svg',
    iconSize: [20, 20]
  })
  const busStopIcon = new Icon({
    iconUrl: '/bus-stop.svg',
    iconSize: [19, 20]
  })
  const errorIcon = new Icon({
    iconUrl: '/error-icon.svg',
    iconSize: [19, 20]
  })

  if (loading) { // ( ͡° ͜ʖ ͡°)
    return (
      <div className=' flex-1' style={{ width: '100%', height: '50vh' }}>
      <Skeleton height={'50vh'} />
      </div>
    )
  }

  return (
    <>
    <section>
    <MapContainer
    style={{ width: '100%', height: '55vh', zIndex: 0 }}
    center={[getLatitude(userCoords!) == 0 ? '28.126' : getLatitude(userCoords!), getLongitude(userCoords!) == 0 ? '-15.438' : getLongitude(userCoords!)]}
    zoom={13}
    scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.maps.jwestman.net/data/streets_v3/{z}/{x}/{y}.pbf"
      />

      {Zoom >= 13 ? <MyMarkers data={loadedStops == undefined ? defaultData : loadedStops} /> : null }
      <GetMapData/>
      <UserMarker coords={userCoords}/>

    </MapContainer>
    </section>
    <section className='absolute right-5 bottom-10'>
      <LocationButton/>
    </section>
    </>
  )
}

export default Map
