import * as Ariakit from '@ariakit/react'
import { matchSorter } from 'match-sorter'
import { startTransition, useMemo, useState } from 'react'
import stops from '../../../server/src/data/paradas.json'
// import { trpc } from '../utils/trpc.js'

export default function SearchBar () {
  // const { data: stops } = trpc.paradas.list.useQuery()
  const [searchValue, setSearchValue] = useState('')
  const matches = useMemo(() => {
    // todo: implementar resolvedor de acrónimos (ind. => industria, ctra. => carretera)
    const results = matchSorter(stops, searchValue, { keys: ['id', 'name'], keepDiacritics: true, threshold: matchSorter.rankings.CONTAINS })
    return results.sort((a, b) => parseInt(a.id) - parseInt(b.id))
  }, [searchValue])

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
        {(matches.length > 0)
          ? (
              matches.map(({ id, name }) => (
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
