/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as Ariakit from '@ariakit/react'
import { matchSorter } from 'match-sorter'
import { startTransition, useMemo, useState } from 'react'
import { orderByDistance, getLatitude } from 'geolib'
import stops from '../../../server/src/data/paradas.json'
// import { trpc } from '../utils/trpc.js'

export default function SearchBar () {

  interface coordinateTest {
    latitude: number;
    longitude: number;
  }
  // const { data: stops } = trpc.paradas.list.useQuery()
  const [searchValue, setSearchValue] = useState('')
  const[closeStops, setCloseStops] = useState('')
  const [userLocation, setUserLocation] = useState<coordinateTest>({
    longitude:0,
latitude:0,  
})

  const matches = useMemo(() => {
    // todo: implementar resolvedor de acrónimos (ind. => industria, ctra. => carretera)
    const results = matchSorter(stops, searchValue, { keys: ['id', 'name'], keepDiacritics: true, threshold: matchSorter.rankings.CONTAINS })
    console.log(results);
    return results.sort((a, b) => parseInt(a.id) - parseInt(b.id))
  }, [searchValue])

  const coordinates = stops.map(item => {
    if(item.latitude){
      return {
        "latitude": item.latitude!,
        "longitude": item.longitude!
      };
    }else{
      return { //no coordinates, set to 0
        "latitude": '0',
        "longitude": '0'
      };
    }
    
  });

  //console.log(coordinates);

  const getUserLocation = () => {
    //console.log('ubu')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })

          let lecum = orderByDistance(userLocation,coordinates).slice(0,12);
          console.log(lecum)
          lecum.forEach(element => {
            let found = matches.find(({latitude}) => latitude == getLatitude(element));
          console.log(found)
          });
        },
        (error) => {
          console.error('Error get user location: ', error)
        }
      )
    } else {
      console.log('Geolocation is not supported by this browser')
    }
    console.log(userLocation?.latitude + ' - ' + userLocation?.longitude)
  }

  

  return (
    <Ariakit.ComboboxProvider
      setValue={(value) => {
        startTransition(() => { setSearchValue(value) })
      }}
    >
      <Ariakit.ComboboxLabel className="label">
        Buscador de paradas
      </Ariakit.ComboboxLabel>
      <Ariakit.Combobox placeholder="Mesa y López" className="w-72 p-2 bg-neutral-500 placeholder-neutral-100 text-neutral-50 shadow-md rounded-lg" />
      <Ariakit.ComboboxPopover gutter={3} sameWidth className="max-h-96 overflow-y-scroll overflow-x-hidden flex flex-col gap-1 p-1 bg-neutral-500 text-neutral-50 shadow-lg rounded-md">
      <Ariakit.ComboboxItem onClick={getUserLocation}>

              <p className='w-auto h-auto text-wrap break-words'>Test</p>

              </Ariakit.ComboboxItem>
        {(matches.length > 0)
          ? (matches.map(({ id, name }) => (
                <Ariakit.ComboboxItem
                  key={id}
                  className=""
                >
                  <a className='p-1 flex flex-row gap-2' href={`/parada/${id}`}>
                    <span className="min-w-[4ch] h-fit text-center p-1 bg-neutral-700 font-mono text-sm">{id}</span>
                    <p className='w-auto h-auto text-wrap break-words'>{name}</p>
                  </a>
                </Ariakit.ComboboxItem>
            ))
            )
          : (
              <div className="no-results">No hay resultados</div>
            )}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  )
}
