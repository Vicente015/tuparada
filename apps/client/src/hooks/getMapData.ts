import type { GeolibInputCoordinates } from 'geolib/es/types'
import { useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'

export function getMapData () {
  const [mapData, setMapData] = useLocalStorageState<GeolibInputCoordinates[]>('mapData')
  const [stopCoords, setStopCoors] = useState<GeolibInputCoordinates[]>()
  const [userCoords, setUserCoors] = useLocalStorageState<GeolibInputCoordinates>('userCoords')
  const [openMap, setOpenMap] = useLocalStorageState<Boolean>('openMap', { defaultValue: false })

  const addStops = (coords: GeolibInputCoordinates[]) => {
    console.log(coords)
    setMapData(coords)
  }
  const addStopsCoords = (coords: GeolibInputCoordinates[]) => {
    console.log(coords)
    setStopCoors(coords)
  }
  const addUserCoords = (coords: GeolibInputCoordinates) => {
    console.log(coords)
    setUserCoors(coords)
  }

  const setMapState = (open: Boolean) => {
    console.log(open)
    setOpenMap(open)
  }
  /*
  const unStarStop = (stop: number) => {
    const index = starredStops.indexOf(stop)
    setStarredStops(starredStops.toSpliced(index, 1))
  }
*/
  return {
    mapData,
    userCoords,
    openMap,
    setMapState,
    addStops,
    addStopsCoords,
    addUserCoords

  }
}
