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
      new Set(data?.lineas.map(({ numero }) => numero))
    ).map((numero) => ({ numero, color: data?.lineas.find(searchLine => searchLine.numero === numero)?.color }))
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
            <h2 className='text-neutral-50 font-bold'>{data?.nombre}</h2>
          </div>
          <div className='flex flex-row gap-1'>
            {uniqueLines.map(({ color, numero }) => (
              <span key={numero} className='px-2 py-1 bg-gray-400 text-neutral-50 font-bold shadow-sm' style={{ backgroundColor: `#${color}` }}>{numero}</span>
            ))}
          </div>
          <div className='text-right'>
            <p className='text-sm text-neutral-600'>Última actualización: {lastUpdate.toLocaleString('es-es', { timeStyle: 'medium', dateStyle: 'medium' })}</p>
          </div>
        </section>
        {data?.lineas.map(({ destino, llegada, numero }) => (
          <p key={numero + destino}>{numero} - {destino} - {llegada}</p>
        ))}
      </main>
    </div>
  )
}

export default Stop
