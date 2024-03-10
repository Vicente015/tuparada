import 'leaflet/dist/leaflet.css'
import { getLatitude, getLongitude } from 'geolib'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { getMapData } from '../hooks/getMapData'

const Map: React.FC = () => {
  const { mapData, userCoords } = getMapData()
  const userCoordsTest = userCoords
  const [test, setTest] = useState('')

  const MyMarkers = ({ data }: any) => {
    return data.map((item: any, index: any) => (
      <PointMarker
        key={index}
        content={item.name}
        center={{ lat: item.latitude, lng: item.longitude }}
      />
    ))
  }

  const locations = [
    {
      id: '772',
      name: 'C/ PINTOR JUAN GUILLERMO (C.C. LA MINILLA)',
      latitude: '28.12556023',
      longitude: '-15.43871993'
    },
    {
      id: '770',
      name: 'C/ PINTOR JUAN GUILLERMO, FRENTE 19',
      latitude: '28.12753066',
      longitude: '-15.43765411'
    },
    {
      id: '779',
      name: 'AVDA. GARCIA LORCA, FRENTE 14',
      latitude: '28.12791265',
      longitude: '-15.43881179'
    },
    {
      id: '789',
      name: 'AVDA. GARCIA LORCA, 17',
      latitude: '28.12521295',
      longitude: '-15.44032022'
    },
    {
      id: '703',
      name: 'AVDA. DE ANSITE (CEMENTERIO DEL PUERTO)',
      latitude: '28.12391100',
      longitude: '-15.43858200'
    },
    {
      id: '702',
      name: 'AVDA. DE ANSITE ( FRENTE CEMENTERIO DEL PUERTO)',
      latitude: '28.12374403',
      longitude: '-15.43849903'
    },
    {
      id: '312',
      name: 'PASEO DE CHIL (ESTADIO INSULAR)',
      latitude: '28.12817245',
      longitude: '-15.43540648'
    },
    {
      id: '777',
      name: 'C/ HABANA, 28',
      latitude: '28.12923800',
      longitude: '-15.43977800'
    },
    {
      id: '768',
      name: 'C/ HABANA, 27',
      latitude: '28.12935000',
      longitude: '-15.43959200'
    },
    {
      id: '497',
      name: 'AVDA. MESA Y LÓPEZ, 85',
      latitude: '28.12973954',
      longitude: '-15.44068230'
    },
    {
      id: '301',
      name: 'AVDA. ESCALERITAS (CLUB LA CORNISA)',
      latitude: '28.12305500',
      longitude: '-15.43593238'
    },
    {
      id: '437',
      name: 'AVDA. MESA Y LOPEZ, 86',
      latitude: '28.13008803',
      longitude: '-15.44059819'
    }
  ]

  const PointMarker = ({ center, content }: any) => {
    const map = useMap()
    const markerRef = useRef(null)

    return (
      <Marker ref={markerRef} position={center}>
        <Popup>{content}</Popup>
      </Marker>
    )
  }

  useEffect(() => {
    console.log('Lecum twice')
    setTest('juan')
    // add navigate to user location
  }, [mapData])

  if (mapData !== undefined) {
    return null // or return some loading indicator if needed
  }

  return (
    <MapContainer style={{ width: '100%', height: '100vh' }} center={[28.126, -15.432]} /* center={[userCoords === undefined ? '28.126' : getLatitude(userCoords!), userCoords === undefined ? '-15.438' : getLongitude(userCoords!)]} */ zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MyMarkers data={locations} />
    </MapContainer>
  )
}

export default Map
