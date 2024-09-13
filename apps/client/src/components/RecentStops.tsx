import stops from '@tuparada/server/src/data/paradas.json'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatStopName } from '../utils/formatStopName'

const RecentStops: React.FC = () => {
  const { recentStops } = useLocalStorage()

  return (
    <section className='flex flex-col gap-2'>
      {recentStops.map((stopId) => {
        const stopName = stops.find(({ id }) => parseInt(id) === stopId)?.name
        return (
          <div key={stopId} className='flex flex-row p-4 py-2 bg-neutral-200 shadow-sm rounded-md hover:bg-neutral-300'>
            <a href={`/parada/${stopId}`} className='flex flex-row gap-2 items-center w-full'>
              <small className='min-w-[3.5ch] h-fit text-left p-[0.1rem] font-mono text-base text-neutral-800'>{stopId}</small>
              <p className='text-xl text-neutral-950 font-medium text-balance break-word'>{stopName !== undefined && formatStopName(stopName)}</p>
            </a>
          </div>
        )
      })}
    </section>)
}

export default RecentStops
