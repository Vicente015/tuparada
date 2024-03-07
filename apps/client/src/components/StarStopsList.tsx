import { StarOffIcon } from 'lucide-react'
import stops from '../../../server/src/data/paradas.json'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatStopName } from '../utils/formatStopName'

const StarStopsList: React.FC = () => {
  const { starredStops, unStarStop } = useLocalStorage()

  return (
    <section className='flex flex-col gap-2'>
      {starredStops.map((stopId) => {
        const stopName = stops.find(({ id }) => parseInt(id) === stopId)?.name
        return (
          <div key={stopId} className='flex flex-row p-4 bg-blue-200 rounded-md'>
            <a href={`/parada/${stopId}`} className='flex flex-row gap-4 items-center w-fit'>
              <small className='font-mono text-base text-neutral-800'>{stopId}</small>
              <p className='text-xl text-neutral-950 font-medium text-balance break-word w-fit'>{stopName !== undefined && formatStopName(stopName)}</p>
            </a>
            <button type="button" className='ml-auto' onClick={() => { unStarStop(stopId) }}>
              <StarOffIcon className='text-neutral-600 hover:text-neutral-800' size={28}></StarOffIcon>
            </button>
          </div>
        )
      })}
    </section>
  )
}

export default StarStopsList
