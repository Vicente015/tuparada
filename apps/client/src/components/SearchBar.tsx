import * as Ariakit from '@ariakit/react'
import { getLatitude, orderByDistance } from 'geolib'
import { MapPin } from 'lucide-react'
import { matchSorter } from 'match-sorter'
import { startTransition, useEffect, useMemo, useState } from 'react'
import stops from '../../../server/src/data/paradas.json'
import { getMapData } from '../hooks/getMapData'
import { formatStopName } from '../utils/formatStopName'

const coordinates = stops
  .filter((item) => item.latitude !== undefined && item.longitude !== undefined)
  .map(item => ({
    latitude: parseFloat(item.latitude ?? '0'),
    longitude: parseFloat(item.longitude ?? '0')
  }))
// import { trpc } from '../utils/trpc.js'

export default function SearchBar () {
  interface coordinateTest {
    latitude: number
    longitude: number
  }

  // const { data: stops } = trpc.paradas.list.useQuery()
  const [searchValue, setSearchValue] = useState('')
  const [searchLocal, setSearchLocal] = useState(false)
  const [userLocation, setUserLocation] = useState<coordinateTest>({
    longitude: 0,
    latitude: 0
  })
  const [closerStops, setCloserStops] = useState<any>()
  const { addStops, addStopsCoords, addUserCoords, mapData, setMapState } = getMapData()

  const matches = useMemo(() => {
    // todo: implementar resolvedor de acrónimos (ind. => industria, ctra. => carretera)
    const results = matchSorter(stops, searchValue, { keys: ['id', 'name'], keepDiacritics: true, threshold: matchSorter.rankings.CONTAINS })
    setSearchLocal(false)
    return results.sort((a, b) => parseInt(a.id) - parseInt(b.id))
  }, [searchValue])

  useEffect(() => { //todo : encontrar mejor manera de implementar
    setMapState(false)
  },[])
useEffect(() => {
    const { latitude, longitude } = userLocation
    const nearbyCords = orderByDistance({ latitude, longitude }, coordinates).slice(0, 12)

    const nearbyStops = nearbyCords
      .map((element) => {
        return matches.find(({ latitude }) => latitude == getLatitude(element))
      }).filter(found => found?.latitude && found?.longitude) // Filter out any undefined elements
    
    addStops(nearbyStops as any)
    addStopsCoords(nearbyCords)
    addUserCoords(userLocation)
    setCloserStops(nearbyStops)
  }, [userLocation])



  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setSearchLocal(true)
          setMapState(true)
          setSearchValue('')
          setUserLocation({ latitude, longitude })
        },
        (error) => {
          console.error('Error get user location: ', error)
        }
      )
    } else {
      console.log('Geolocation is not supported by this browser')
    }
  }

  return (
    <Ariakit.ComboboxProvider
      setValue={(value) => {
        startTransition(() => { setSearchValue(value) })
      }}
    >
      <Ariakit.ComboboxLabel>
        Buscador de paradas
      </Ariakit.ComboboxLabel>
      <Ariakit.Combobox placeholder="Mesa y López" className="text-base w-80 p-2 bg-neutral-100 placeholder-neutral-800 text-neutral-900 shadow-sm rounded-md" />
      <Ariakit.ComboboxPopover gutter={3} sameWidth className="max-h-96 overflow-y-scroll overflow-x-hidden flex flex-col gap-2 p-1 bg-neutral-100 text-neutral-900 shadow-xl rounded-md">
        <Ariakit.ComboboxItem onClick={getUserLocation}>
            <a className='w-auto h-auto break-words p-1 flex flex-row gap-2'>
            <MapPin />
              <p>Buscar paradas cercanas</p>
            </a>
        </Ariakit.ComboboxItem>

        {(searchLocal) // y no hay resultados cercanos (matches.length > 0)
          ? (
              closerStops.map(({ id, name }: any) => (
                <Ariakit.ComboboxItem key={id} className="text-neutral-900 border-b-[1px] border-b-neutral-200">
                  <a className='p-1 flex flex-row gap-2' href={`/parada/${id}`}>
                    <span className="min-w-[3.5ch] h-fit text-center p-[0.1rem] bg-neutral-300 font-mono text-sm rounded-sm">{id}</span>
                    <p className='w-auto h-auto break-words text-base'>{name.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)).join(' ')}</p>
                  </a>

                </Ariakit.ComboboxItem>
              ))
            )
          : (
            <div className="no-results"></div>
            )
        }
        {(!searchLocal) // y no hay resultados cercanos (matches.length > 0)
          ? (
              matches.map(({ id, name }) => (
                <Ariakit.ComboboxItem key={id} className="text-neutral-900 border-b-[1px] border-b-neutral-200">
                  <a className='p-1 flex flex-row gap-2' href={`/parada/${id}`}>
                    <span className="min-w-[3.5ch] h-fit text-center p-[0.1rem] bg-neutral-300 font-mono text-sm rounded-sm">{id}</span>
                    <p className='w-auto h-auto break-words text-base'>{name.split(' ').map(word => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)).join(' ')}</p>
                  </a>
                </Ariakit.ComboboxItem>
              ))
            )
          : (
              <div className="no-results"></div>
            )
        }
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  )
}
