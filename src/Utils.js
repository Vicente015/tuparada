import userAgents from 'top-user-agents'
import uniqueRandomArray from 'unique-random-array'

const genRandomUserAgent = () => uniqueRandomArray(userAgents)()

export {
  genRandomUserAgent
}
