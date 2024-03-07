import { StarIcon } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Props {
  stop: number
}

const StarStop: React.FC<Props> = ({ stop }) => {
  const { starredStops, starStop, unStarStop } = useLocalStorage()
  const isStopSaved = starredStops?.includes(stop)
  const onStarClick = () => { isStopSaved ? unStarStop(stop) : starStop(stop) }

  return (
    <button className='flex flex-row gap-1' type="button" onClick={onStarClick}>
      <StarIcon id='starIcon' className={`text-neutral-700 ${isStopSaved && 'fill-yellow-300'}`} size={28}></StarIcon>
    </button>
  )
}

export default StarStop
