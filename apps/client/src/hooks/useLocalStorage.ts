import useLocalStorageState from 'use-local-storage-state'

export function useLocalStorage () {
  const [starredStops, setStarredStops] = useLocalStorageState<number[]>('starredStops', { defaultValue: [] })
  const [recentStops, setRecentStops] = useLocalStorageState<number[]>('recentSearch', { defaultValue: [] })

  const starStop = (stop: number) => {
    setStarredStops([...starredStops, stop])
  }

  const unStarStop = (stop: number) => {
    const index = starredStops.indexOf(stop)
    setStarredStops(starredStops.toSpliced(index, 1))
  }

  const addRecentStop = (stop: number) => {
    if (!recentStops.includes(stop)) setRecentStops([stop, ...recentStops].slice(0, 4))
  }

  return {
    starredStops,
    starStop,
    unStarStop,
    recentStops,
    addRecentStop
  }
}
