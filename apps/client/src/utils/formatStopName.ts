export const formatStopName = (name: string) => name
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
  .join(' ')
