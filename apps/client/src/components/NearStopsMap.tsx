import 'leaflet/dist/leaflet.css'
import { getLatitude, getLongitude } from 'geolib'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { getMapData } from '../hooks/getMapData'
import type { GeolibInputCoordinates } from 'geolib/es/types'
import { Icon } from 'leaflet'





const Map: React.FC = () =>  {
  const { mapData, userCoords, openMap, setMapState } = getMapData(); 

  const PointMarker = ({ center, name, id, icon }: any) => {
    const map = useMap()
    const markerRef = useRef(null)
    map.flyTo([getLatitude(userCoords!), getLongitude(userCoords!)], map.getZoom());

    return (
      <Marker ref={markerRef} position={center} icon={icon!==undefined? icon:busStopIcon}>
        {name?
          <Popup>
            <a className='p-1 flex flex-row gap-2 items-center' href={`/parada/${id}`}>
              <span className="min-w-[3.5ch] h-fit text-center p-[0.1rem] bg-neutral-300 font-mono text-sm rounded-sm">{id}</span>
              <p className='w-auto h-auto break-words text-base !my-0'>{name.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)).join(' ')}</p>
            </a>
          </Popup> 
        :
          <></>
        }
      </Marker>
    )
  }


  const MyMarkers = ({ data }: any) => {
    return data.map((item: any, index: any) => (
      <PointMarker
        //key={index} might be needed later
        name={item.name}
        id={item.id}
        center={{ lat: item.latitude, lng: item.longitude }}
      />
    ))
  }

  const UserMarker = ({coords}:any) => {
    return(
      <PointMarker
        //key={index}
        center={{ lat: getLatitude(coords), lng: getLongitude(coords) }}
        icon={mapIcon}
      />
    )
  }

  const mapIcon = new Icon({
    iconUrl:'../../public/circle-user.svg',
    iconSize:     [20, 20],
  })
  const busStopIcon = new Icon({
    iconUrl:'../../public/bus-stop.svg',
    iconSize:     [45, 45],
  })

  //todo: Mejorar el cierre del mapa
  const closeMap = () => {
    setMapState(false)
  }
    
  if (!openMap) {
    return (
      null    
    )
  }

  return (
    <>
    <MapContainer style={{ width: '100%', height: '50vh' }} center={[getLatitude(userCoords!) == 0 ? '28.126' : getLatitude(userCoords!), getLongitude(userCoords!) == 0 ? '-15.438' : getLongitude(userCoords!)]}  zoom={15} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MyMarkers data={mapData} />
      <UserMarker coords={userCoords}/>
    </MapContainer>
    <button className='btn' onClick={closeMap}>Cerrar</button>
    </>
  )
}

export default Map
