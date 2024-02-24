import * as Ariakit from '@ariakit/react'
import { pascalCase } from 'case-anything'
import { matchSorter } from 'match-sorter'
import { startTransition, useMemo, useState } from 'react'
import { trpc } from '../utils/trpc'

export default function SearchBar () {
  const { data: stops } = trpc.paradas.list.useQuery()
  const [searchValue, setSearchValue] = useState('')
  const matches = useMemo(() => {
    const results = matchSorter(stops ?? [], searchValue, { keys: ['nombre', 'numero'] })
    results.length = 10
    return results.map(({ nombre, numero }) =>
      ({ numero, nombre: pascalCase(nombre, { keep: [' '] }) })
    )
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
      <Ariakit.ComboboxPopover gutter={3} sameWidth className="flex flex-col gap-1 p-2 bg-neutral-500 text-neutral-50 shadow-lg rounded-md">
        {(matches.length > 0)
          ? (
              matches.map(({ nombre, numero }) => (
                <Ariakit.ComboboxItem
                  key={numero}
                  className="text-left rounded-sm"
                >
                  <p className='p-1 flex flex-row gap-2'>
                    <span className="p-1 bg-neutral-700 h-fit font-mono text-sm">{String(numero).padStart(3, '0')}</span>
                    {nombre}
                  </p>
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
