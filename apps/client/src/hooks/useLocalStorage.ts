import useLocalStorageState from 'use-local-storage-state'

export function useLocalStorage () {
  const [starredStops, setStarredStops] = useLocalStorageState<number[]>('starredStops', { defaultValue: [] })

  const starStop = (stop: number) => {
    setStarredStops([...starredStops, stop])
  }

  const unStarStop = (stop: number) => {
    const index = starredStops.indexOf(stop)
    setStarredStops(starredStops.toSpliced(index, 1))
  }

  return {
    starredStops,
    starStop,
    unStarStop
  }
}
