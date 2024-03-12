import type { GeolibInputCoordinates } from 'geolib/es/types'
import { useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'

export function getMapData () {
  const [mapData, setMapData] = useLocalStorageState<GeolibInputCoordinates[]>('mapData')
  //const [allCoords, setAllCoords] = useState<GeolibInputCoordinates[]>()
  const [userCoords, setUserCoors] = useLocalStorageState<GeolibInputCoordinates>('userCoords')
  const [openMap, setOpenMap] = useLocalStorageState<Boolean>('openMap', { defaultValue: false })
  const [numClick, setNumClicks] = useLocalStorageState('numClick',{defaultValue:0})


  const addStops = (coords: GeolibInputCoordinates[]) => {
    setMapData(coords)
  }
 /*   const addAllCoords = (coords: GeolibInputCoordinates[]) => {
    //console.log(coords)
    setAllCoords(coords)
  }  */
  const addUserCoords = (coords: GeolibInputCoordinates) => {
    setUserCoors(coords)
  }

  const setMapState = (open: Boolean) => {
    setOpenMap(open)
  }

  const addClick = () =>{
    console.log(numClick)
    setNumClicks(numClick+1)
  }

  return {
    mapData,
    userCoords,
    openMap,
    numClick,
    setMapState,
    addStops,
    addUserCoords,
    addClick

  }
}
