import { ChevronLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { trpc } from '../utils/trpc'

interface Props {
  stop: number
}

const Stop: React.FC<Props> = ({ stop }) => {
  const { data, mutate } = trpc.paradas.get.useMutation({ cacheTime: 5000 })
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const uniqueLines = useMemo(() => {
    return Array.from(
      new Set(data?.lines.map(({ number }) => number))
    ).map((number) => ({ number, color: data?.lines.find(searchLine => searchLine.number === number)?.color }))
  }, [data])

  useEffect(() => {
    setLastUpdate(new Date())
    mutate({ id: stop })
  }, [])

  return (
    <div className='max-w-[90ch] m-auto'>
      <header className='bg-neutral-500 flex flex-row gap-4 items-center p-4'>
        <a href="/">
          <ChevronLeft className='text-neutral-100' size={28} />
        </a>
        <h2 className='text-xl font-bold text-neutral-50 m-auto'>Próximas Guaguas</h2>
      </header>
      <main className='bg-neutral-100 h-screen'>
        <section className='bg-neutral-400 p-4'>
          <div className='flex flex-row gap-2'>
            <h4 className='text-neutral-200 font-mono'>{stop}</h4>
            <h2 className='text-neutral-50 font-bold'>{data?.name}</h2>
          </div>
          <div className='flex flex-row gap-1'>
            {uniqueLines.map(({ color, number }) => (
              <span key={number} className='px-2 py-1 bg-gray-400 text-neutral-50 font-bold shadow-sm' style={{ backgroundColor: `#${color}` }}>{number}</span>
            ))}
          </div>
          <div className='text-right'>
            <p className='text-sm text-neutral-600'>Última actualización: {lastUpdate.toLocaleString('es-es', { timeStyle: 'medium', dateStyle: 'medium' })}</p>
          </div>
        </section>
        {data?.lines.map(({ arrival_time, destination, number }) => (
          <p key={number + destination}>{number} - {destination} - {arrival_time}</p>
        ))}
      </main>
    </div>
  )
}

export default Stop
