import 'leaflet/dist/leaflet.css'
import { getLatitude, getLongitude } from 'geolib'
import type { GeolibInputCoordinates } from 'geolib/es/types'
import stops from '../../../server/src/data/paradas.json'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { getMapData } from '../hooks/getMapData'
import { Bounds, Icon, latLng, latLngBounds, rectangle } from 'leaflet'


const coordinates = stops
  .filter((item) => item.latitude !== undefined && item.longitude !== undefined)
  .map(item => ({
    ...item,
    latitude: parseFloat(item.latitude ?? '0'),
    longitude: parseFloat(item.longitude ?? '0')
  }))


const Map: React.FC = () =>  {
  const { mapData, userCoords, openMap, setMapState,numClick } = getMapData(); 
  const [Zoom, setZoomHook] = useState(15);
  const [firstZoom, setFirstZoom] = useState(true)
  const [loadedStops, setLoadedStops] = useState<any[]>() //change any to type
  const [map, setMap] = useState<any>(null); //change any to type


  const PointMarker = ({ center, name, id, icon }: any) => {
    const markerRef = useRef(null)
    const map = useMap()
    var corner1 = latLng(28.300640, -15.716717), //todo: change to use userCoords as reference
    corner2 = latLng(27.889199, -15.144883),
    bounds = latLngBounds(corner1, corner2);
    map.setMaxBounds(bounds)
    map.setMinZoom(10)

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

/*   const MapEvents = () => {
  const map = useMap()
     useMapEvents({
      zoomend() { // zoom event (when zoom animation ended)
        //const zoom = map.getZoom(); // get current Zoom of map
        //setZoomHook(zoom);//todo : fix jerky motion when zooming in and out
        //juan(map)
      },
       dragend(){
        if(map.getZoom()>=16){
          console.log("sa movio")
        }
      } 
    }); 
    return false;
  }
 */
  /* function juan(map:any){
    //const map = useMap()
    //console.log(firstZoom)
    if(firstZoom){
      map.flyTo([getLatitude(userCoords!), getLongitude(userCoords!)], map.getZoom());
      setFirstZoom(false)
    }
    if(map.getZoom()>=16){
      console.log("tamo cerquita")
    }
      
  } */
   


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

const GetMapData =()=>{
const map = useMap()
let stopsInView: { latitude: number; longitude: number; id: string; name: string }[] =[]
//let bounds = map.getBounds()
//console.log(bounds)
useMapEvents({
  zoomend() { // zoom event (when zoom animation ended)
    /* const zoom = map.getZoom(); /</ get current Zoom of map
    setZoomHook(zoom);//todo : fix jerky motion when zooming in and out
    juan(map) */
    const zoom = map.getZoom(); // get current Zoom of map
    setZoomHook(zoom);//todo : fix jerk
    let bounds = map.getBounds()
    stopsInView =[]
    //console.log("el zoomo")
    for(let item of coordinates){
      if(bounds.contains([item.latitude,item.longitude]) && map.getZoom()>=16){
        
        stopsInView.push(item)
      }
    }
    updateLoadedStops(stopsInView)
  },dragend(){
    let bounds = map.getBounds()
    stopsInView =[]
    //console.log("gradados")
    for(let item of coordinates){
      if(bounds.contains([item.latitude,item.longitude]) && map.getZoom()>=16){
        
        stopsInView.push(item)
      }
    }
    //console.log(stopsInView)
    //console.log(map.getZoom())
    updateLoadedStops(stopsInView)
  }
});
/* 
for(let item of coordinates){
  if(bounds.contains([item.latitude,item.longitude]) && map.getZoom()>=16){
    
    stopsInView.push(item)
  }
}
console.log(stopsInView) */
//updateLoadedStops(stopsInView)
  return null;
}


  const updateLoadedStops = (coords: typeof coordinates) => {
// Filter out elements from newArray that are already in loadedStops
    const uniqueNewElements = coords.filter((element) => !loadedStops!.includes(element));

    // Combine the unique elements from newArray with the current loadedStops
    const updatedStops = [...loadedStops!, ...uniqueNewElements];

    // Update the state with the new array
    setLoadedStops(updatedStops);

    // If you want to return the updated array, you can do so
    //return updatedStops;
  };

  useEffect(() =>{
    setLoadedStops(mapData)
    console.log("Datos inizializados")
  
  },[])
 
useEffect(() =>{
  setLoadedStops(mapData)
  console.log("useEffect se ejecuta")
  console.log(loadedStops)
/* if(loadedStops!==undefined){
  //const updatedArray = updateLoadedStops(coordinates as any);
    //console.log('Updated Array:', updatedArray);
  } */

},[numClick])



  const mapIcon = new Icon({
    iconUrl:'../../public/circle-user.svg',
    iconSize:     [20, 20],
  })
  const busStopIcon = new Icon({
    iconUrl:'../../public/bus-stop.svg',
    iconSize:     [19, 20],
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
    
    <MapContainer  
    style={{ width: '100%', height: '50vh' }} 
    center={[getLatitude(userCoords!) == 0 ? '28.126' : getLatitude(userCoords!), getLongitude(userCoords!) == 0 ? '-15.438' : getLongitude(userCoords!)]}  
    zoom={15} 
    scrollWheelZoom={true}
    
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
     {/*  <MapEvents />  */}
      
      {Zoom >=12 ? <MyMarkers data={loadedStops} /> : null }
      <GetMapData/>
      <UserMarker coords={userCoords}/>
     
    </MapContainer>
 
    
  )
     /* <button className='btn' onClick={closeMap}>Cerrar</button> */
}

export default Map
