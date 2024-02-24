import { router } from '../trpc.js'
import { paradasRouter } from './paradas.js'

/**
 * Definition of the routes and routers
 */
const appRouter = router({
  paradas: paradasRouter
})

export { appRouter }
export type AppRouter = typeof appRouter
