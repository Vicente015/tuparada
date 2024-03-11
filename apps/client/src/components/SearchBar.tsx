import * as Ariakit from '@ariakit/react'
import { orderByDistance } from 'geolib'
import { MapPinIcon, SearchIcon } from 'lucide-react'
import { matchSorter } from 'match-sorter'
import { startTransition, useEffect, useMemo, useState } from 'react'
import stops from '../../../server/src/data/paradas.json'
import { getMapData } from '../hooks/getMapData'
import { formatStopName } from '../utils/formatStopName'
import normalizeAbbreviations from '../utils/normalizeAbbreviations'

const coordinates = stops
  .filter((item) => item.latitude !== undefined && item.longitude !== undefined)
  .map(item => ({
    ...item,
    latitude: parseFloat(item.latitude ?? '0'),
    longitude: parseFloat(item.longitude ?? '0')
  }))

export default function SearchBar () {
  const stopsWithoutAbbv = useMemo(() => {
    return stops.map((stop) => ({ ...stop, name: normalizeAbbreviations(stop.name) }))
  }, [])

  const [searchValue, setSearchValue] = useState('')
  const [searchLocal, setSearchLocal] = useState(false)
  const [userLocation, setUserLocation] = useState({
    longitude: 0,
    latitude: 0
  })
  const [closerStops, setCloserStops] = useState<typeof coordinates>()
  const { addStops, addStopsCoords, addUserCoords, mapData, setMapState } = getMapData()

  const matches = useMemo(() => {
    // todo: implementar resolvedor de acrónimos (ind. => industria, ctra. => carretera)
    const results = matchSorter(stops, searchValue, { keys: ['id', 'name'], keepDiacritics: true, threshold: matchSorter.rankings.CONTAINS })
    setSearchLocal(false)
    return results.sort((a, b) => parseInt(a.id) - parseInt(b.id))
  }, [searchValue])

  useEffect(() => { // todo : encontrar mejor manera de implementar
    setMapState(false)
  }, [])
  useEffect(() => {
    const { latitude, longitude } = userLocation
    const nearbyCords = orderByDistance({ latitude, longitude }, coordinates).slice(0, 900)

    const nearbyStops = nearbyCords.filter(Boolean)
    addStops(nearbyStops)
    addStopsCoords(nearbyCords)
    addUserCoords(userLocation)
    setCloserStops(nearbyStops as any)
  }, [userLocation])

  const getUserLocation = () => {
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
  }

  return (
    <Ariakit.ComboboxProvider
      setValue={(value) => {
        startTransition(() => { setSearchValue(value) })
      }}
    >
      <div className="w-[22rem] bg-neutral-100 flex flex-row items-center justify-between gap-2 p-3 px-2 shadow-sm rounded-md focus-within:outline-2 focus-within:outline-blue-400 focus-within:outline">
        <SearchIcon className='text-neutral-950'></SearchIcon>
        <Ariakit.Combobox autoFocus placeholder="Nombre de la parada" className="bg-transparent w-full text-base placeholder-neutral-700 text-neutral-900 outline-none" aria-label='Buscador de paradas' />
        <Ariakit.ComboboxCancel className='text-neutral-900 w-fit text-xl'></Ariakit.ComboboxCancel>
      </div>
      <Ariakit.ComboboxPopover
        gutter={18}
        className="max-h-96 -ml-9 w-[22rem] relative overflow-y-scroll overflow-x-hidden flex flex-col p-1 bg-neutral-100 text-neutral-900 shadow-2xl rounded-md"
      >
        <Ariakit.ComboboxItem>
          <button type='button' onClick={getUserLocation} className='p-2 w-full flex flex-row gap-2 border-b-[1px] border-b-neutral-200 cursor-pointer'>
            <MapPinIcon className='min-w-[3.5ch]' size={26}/>
            <p className='text-base w-auto text-neutral-950 font-semibold'>Buscar paradas cercanas</p>
          </button>
        </Ariakit.ComboboxItem>

        {(searchLocal) // y no hay resultados cercanos (matches.length > 0)
          ? (
              closerStops!.map(({ id, name }) => (
                <Ariakit.ComboboxItem key={id} className="p-2 text-neutral-900 border-b-[1px] border-b-neutral-200">
                  <a className='flex flex-row gap-2' href={`/parada/${id}`}>
                    <span className="min-w-[3.5ch] h-fit text-center p-[0.1rem] bg-neutral-300 font-mono text-sm rounded-sm">{id}</span>
                    <p className='w-auto h-auto break-words text-base'>{formatStopName(name)}</p>
                  </a>
                </Ariakit.ComboboxItem>
              ))
            )
          : (!searchLocal && matches.length > 0) // y no hay resultados cercanos (matches.length > 0)
              ? (
                  matches.map(({ id, name }) => (
                <Ariakit.ComboboxItem key={id} className="p-2 text-neutral-900 border-b-[1px] border-b-neutral-200">
                  <a className='flex flex-row gap-2' href={`/parada/${id}`}>
                    <span className="min-w-[3.5ch] h-fit text-center p-[0.1rem] bg-neutral-300 font-mono text-sm rounded-sm">{id}</span>
                    <p className='w-auto h-auto break-words text-base'>{formatStopName(name)}</p>
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
