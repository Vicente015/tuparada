import type { GeolibInputCoordinates } from 'geolib/es/types'
import { useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'

export function getMapData () {
  const [mapData, setMapData] = useLocalStorageState<GeolibInputCoordinates[]>('mapData')
  const [stopCoords, setStopCoors] = useState<GeolibInputCoordinates[]>()
  const [userCoords, setUserCoors] = useLocalStorageState<GeolibInputCoordinates>('userCoords')
  const [openMap, setOpenMap] = useLocalStorageState<boolean>('openMap', { defaultValue: false })

  const addStops = (coords: GeolibInputCoordinates[]) => {
    setMapData(coords)
  }
  const addStopsCoords = (coords: GeolibInputCoordinates[]) => {
    setStopCoors(coords)
  }
  const addUserCoords = (coords: GeolibInputCoordinates) => {
    setUserCoors(coords)
  }

  const setMapState = (open: Boolean) => {
    setOpenMap(open)
  }

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
