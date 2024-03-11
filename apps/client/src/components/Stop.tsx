import type { inferRouterOutputs } from '@trpc/server'
import { useEffect, useMemo, useState } from 'react'
import type { AppRouter } from 'server/src/routers/_app'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { trpc } from '../utils/trpc'
type IncomingBusType = inferRouterOutputs<AppRouter>['paradas']['get']['lines'][number]

interface Props {
  stop: number
}

const Stop: React.FC<Props> = ({ stop }) => {
  const { data } = trpc.paradas.get.useQuery({ id: stop },
    {
      cacheTime: 25 * 1000,
      refetchInterval: 60 * 1000
    }
  )
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const { addRecentStop } = useLocalStorage()

  const uniqueLines = useMemo(() => {
    return Array.from(
      new Set(data?.lines.map(({ number }) => number))
    )
      .map((number) => ({ number, color: data?.lines.find(searchLine => searchLine.number === number)?.color }))
      .sort((a, b) => parseInt(a.number) - parseInt(b.number))
  }, [data])

  useEffect(() => {
    setLastUpdate(new Date())
  }, [data])

  useEffect(() => {
    addRecentStop(stop)
  }, [])

  return (
    <>
      <section className='bg-neutral-200 p-4 max-w-[90ch] m-auto'>
        <div className='flex flex-row gap-2 mb-1 items-center'>
          <h4 className='text-neutral-800 text-lg font-mono'>{stop}</h4>
          <h2 className='text-neutral-900 text-xl font-bold'>{data?.name}</h2>
        </div>
        <div className='flex flex-row gap-1'>
          {uniqueLines.map(({ color, number }) => (
            <span key={number} className={`px-2 py-1 bg-gray-400 font-bold shadow-sm rounded-sm ${color === 'FFDD00' ? 'text-neutral-900' : 'text-neutral-50'}`} style={{ backgroundColor: `#${color}` }}>{number}</span>
          ))}
        </div>
          <p className='text-right text-[1rem] text-neutral-600'>Última actualización: {lastUpdate.toLocaleString('es-es', { timeStyle: 'medium', dateStyle: 'medium' })}</p>
      </section>
      <section className='flex flex-col bg-neutral-50 h-full max-w-[90ch] m-auto font-medium text-neutral-900'>
        <div className='flex flex-row p-4 pb-0 gap-2 text-neutral-700'>
          <p>Línea</p>
          <p>Destino</p>
          <p className='ml-auto'>Llegada</p>
        </div>
        {data !== undefined
          ? data?.lines.map((data, index) => (
            <IncomingBus key={index} {...data}></IncomingBus>
          ))
          : <p className='text-center font-bold text-xl'>Ha ocurrido un error y no se han obtenido resultados.</p>
        }
        </section>
      </>
  )
}

const IncomingBus: React.FC<IncomingBusType> = ({ arrival_time, color, destination, number }) => {
  return (
    <div key={number + destination} className='p-3 border-b-[1px] border-b-neutral-300 flex flex-row w-full gap-2 items-center'>
      <span className={`min-w-[4ch] h-fit text-center p-[0.1rem] rounded-sm font-bold shadow-sm font-mono ${color === 'FFDD00' ? 'text-neutral-900' : 'text-neutral-50'}`} style={{ backgroundColor: `#${color}` }}>{number}</span>
      <p className='w-fit font-medium text-xl text-neutral-800'>{destination}</p>
      <p className='ml-auto text-xl font-medium text-neutral-950'>{arrival_time.replace('min', ' min')}</p>
    </div>
  )
}

export default Stop
