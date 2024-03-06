import type { inferRouterOutputs } from '@trpc/server'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { AppRouter } from 'server/src/routers/_app'
import { trpc } from '../utils/trpc'
type IncomingBusType = inferRouterOutputs<AppRouter>['paradas']['get']['lines'][number]

interface Props {
  stop: number
}

const Stop: React.FC<Props> = ({ stop }) => {
  console.debug(stop)
  const { data } = trpc.paradas.get.useQuery({ id: stop },
    {
      cacheTime: 25 * 1000,
      refetchInterval: 60 * 1000
    }
  )
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const uniqueLines = useMemo(() => {
    return Array.from(
      new Set(data?.lines.map(({ number }) => number))
    ).map((number) => ({ number, color: data?.lines.find(searchLine => searchLine.number === number)?.color }))
  }, [data])

  useEffect(() => {
    setLastUpdate(new Date())
  }, [data])

  return (
    <div className='max-w-[90ch] m-auto'>
      <header className='bg-neutral-100 flex flex-row gap-4 items-center p-4'>
        <a href="/">
          <ChevronLeft className='text-neutral-700' size={28} />
        </a>
        <h2 className='text-2xl font-bold text-neutral-800 m-auto'>Próximas Guaguas</h2>
      </header>
      <main className='bg-neutral-200 h-screen'>
        <section className='bg-neutral-300 p-4'>
          <div className='flex flex-row gap-2 mb-1'>
            <h4 className='text-neutral-800 text-lg font-mono'>{stop}</h4>
            <h2 className='text-neutral-900 text-xl font-bold'>{data?.name}</h2>
          </div>
          <div className='flex flex-row gap-1'>
            {uniqueLines.map(({ color, number }) => (
              <span key={number} className='px-2 py-1 bg-gray-400 text-neutral-50 font-bold shadow-sm' style={{ backgroundColor: `#${color}` }}>{number}</span>
            ))}
          </div>
          <div className='text-right'>
            <p className='text-base text-neutral-600'>Última actualización: {lastUpdate.toLocaleString('es-es', { timeStyle: 'medium', dateStyle: 'medium' })}</p>
          </div>
        </section>
        <section className='flex flex-col bg-neutral-200 h-full'>
          <IncomingBus arrival_time='Llega en' destination='Destino' number='Línea'></IncomingBus>
          {data?.lines.map((data, index) => (
            <IncomingBus key={index} {...data}></IncomingBus>
          ))}
        </section>
      </main>
    </div>
  )
}

const IncomingBus: React.FC<IncomingBusType> = ({ arrival_time, color, destination, number }) => {
  return (
    <div key={number + destination} className='p-4 text-neutral-700 flex flex-row w-full gap-2 items-center'>
      <span className='px-2 py-1  rounded-md font-bold shadow-sm font-mono text-neutral-50' style={{ backgroundColor: `#${color}` }}>{number}</span>
      <p className='w-fit font-medium text-xl'>{destination}</p>
      <p className='ml-auto'>{arrival_time}</p>
    </div>
  )
}

export default Stop
