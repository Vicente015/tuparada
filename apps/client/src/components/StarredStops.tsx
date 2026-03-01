import stops from '@tuparada/server/src/data/paradas.json'
import { StarOffIcon } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatStopName } from '../utils/formatStopName'

const StarredStops: React.FC = () => {
  const { starredStops, unStarStop } = useLocalStorage()

  return (
    <section className='flex flex-col gap-2'>
      {starredStops.map((stopId) => {
        const stopName = stops.find(({ id }) => parseInt(id) === stopId)?.name
        return (
          <div key={stopId} className='flex flex-row p-4 py-2 bg-neutral-200 shadow-sm rounded-md hover:bg-neutral-300'>
            <a href={`/parada/${stopId}`} className='flex flex-row gap-2 items-center w-full'>
              <small className='min-w-[3.5ch] h-fit text-left font-mono text-base text-neutral-800'>{stopId}</small>
              <p className='text-xl text-neutral-950 font-medium text-balance break-word'>{stopName !== undefined && formatStopName(stopName)}</p>
            </a>
            <button type="button" className='ml-auto' onClick={() => { unStarStop(stopId) }}>
              <StarOffIcon className='text-neutral-500 hover:text-neutral-700' size={26}></StarOffIcon>
            </button>
          </div>
        )
      })}
    </section>
  )
}

export default StarredStops
