import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { trpc } from '../utils/trpc'

interface Props {
  stop: number
}

const Stop: React.FC<Props> = ({ stop }) => {
  const mutation = trpc.paradas.get.useMutation({ cacheTime: 5000 })
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    setLastUpdate(new Date())
    mutation.mutate({ id: stop })
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
            <h4 className='text-neutral-200 font-mono'>{mutation.data?.id}</h4>
            <h2 className='text-neutral-50 font-bold'>{mutation.data?.nombre}</h2>
          </div>
          <div className='flex flex-row gap-1'>
            {mutation.data?.lineas.map(({ numero }) => (
              <span key={numero} className='px-2 py-1 bg-yellow-500 text-neutral-50'>{numero}</span>
            ))}
          </div>
          <div className='text-right'>
            <p className='text-sm text-neutral-600'>Última actualización: {lastUpdate.toLocaleString('es-es', { timeStyle: 'medium', dateStyle: 'medium' })}</p>
          </div>
        </section>
        {mutation.data?.id}
        {mutation.data?.nombre}
        {mutation.data?.lineas.map(({ destino, llegada, numero }) => (
          <p key={numero}>{numero} - {destino} - {llegada}</p>
        ))}
      </main>
    </div>
  )
}

export default Stop
