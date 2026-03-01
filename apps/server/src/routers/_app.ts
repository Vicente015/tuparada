import { router } from '../trpc.js'
import { lineasRouter } from './lineas.js'
import { paradasRouter } from './paradas.js'

/**
 * Definition of the routes and routers
 */
const appRouter = router({
  paradas: paradasRouter,
  lineas: lineasRouter
})

export { appRouter }
export type AppRouter = typeof appRouter
