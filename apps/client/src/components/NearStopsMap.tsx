import 'leaflet/dist/leaflet.css'
import { getLatitude, getLongitude } from 'geolib'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { getMapData } from '../hooks/getMapData'
import type { GeolibInputCoordinates } from 'geolib/es/types'




const Map: React.FC = () =>  {
  const [ numTest, setNumTest] = useState(0)
  const [test, setTest] = useState('')

  
  const { mapData, userCoords, openMap, setMapState } = getMapData(); 
  
  /* const [mapData, setMapData] = useState(undefined);
  const [userCoords, setUserCoords] = useState(undefined); */



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

  const PointMarker = ({ center, name, id }: any) => {
    const map = useMap()
    const markerRef = useRef(null)
    map.flyTo([getLatitude(userCoords!), getLongitude(userCoords!)], map.getZoom());


    return (
      <Marker ref={markerRef} position={center}>
        <Popup>

        <a className='p-1 flex flex-row gap-2 items-center' href={`/parada/${id}`}>
                    <span className="min-w-[3.5ch] h-fit text-center p-[0.1rem] bg-neutral-300 font-mono text-sm rounded-sm">{id}</span>
                    <p className='w-auto h-auto break-words text-base !my-0'>{name.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)).join(' ')}</p>
                  </a>

        </Popup>
      </Marker>
    )
  }


  const MyMarkers = ({ data }: any) => {
    return data.map((item: any, index: any) => (
      <PointMarker
        //key={index}
        name={item.name}
        id={item.id}
        center={{ lat: item.latitude, lng: item.longitude }}
      />
    ))
  }
/*   const testu = async () => {
    console.log("Juan");
    setNumTest(numTest + 1);
    console.log("el mapodato abajo")
    console.log(mapData)
    console.log("el mapodato arriba")
    

  };
   */


  useEffect(() => {
    console.log('Lecum twice')
    setTest('juan')
    console.log(mapData)
    console.log(userCoords)
    console.log(typeof(mapData))
    // add navigate to user location
  }, [mapData, numTest])

  if (!openMap) {
    return (
/*       <button className='testButton' onClick={testu}>Mapabutton sin na</button>
 */ null    
)
  }

  const closeMap = () => {
setMapState(false)
  }

//todo: Mejorar el cierre del mapa
  return (
    <>
    <MapContainer style={{ width: '100%', height: '50vh' }} center={[getLatitude(userCoords!) == 0 ? '28.126' : getLatitude(userCoords!), getLongitude(userCoords!) == 0 ? '-15.438' : getLongitude(userCoords!)]}  zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MyMarkers data={mapData} />
    </MapContainer>
    <button className='btn' onClick={closeMap}>Cerrar</button>
    </>
  )
}

export default Map
