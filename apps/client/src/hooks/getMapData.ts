import type { GeolibInputCoordinates } from 'geolib/es/types'
import { useState } from 'react'

export function getMapData () {
  const [mapData, setMapData] = useState<GeolibInputCoordinates[]>()
  const [stopCoords, setStopCoors] = useState<GeolibInputCoordinates[]>()
  const [userCoords, setUserCoors] = useState<GeolibInputCoordinates>()

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
  /*
  const unStarStop = (stop: number) => {
    const index = starredStops.indexOf(stop)
    setStarredStops(starredStops.toSpliced(index, 1))
  }
*/
  return {
    mapData,
    userCoords,
    addStops,
    addStopsCoords,
    addUserCoords

  }
}
