import { TRPCError } from '@trpc/server'
import got from 'got'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc.js'
const cache = new Map()

const InputSchema = z.object({
  id: z.number().int().min(1).max(999)
})

const OutputSchema = z.object({
  name: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  lines: z.array(z.object({
    destination: z.string(),
    arrival_time: z.string(),
    number: z.string(),
    color: z.string().optional()
  }))
})

const APIResponseSchema = z.object({
  Vehiculos: z.array(z.object({
    Orden: z.number(),
    IdVehiculo: z.number(),
    Concesion: z.number(),
    Comercial: z.string(),
    NombreLinea: z.string(),
    Tiempo: z.string()
  }))
})

export const paradasRouter = router({
  get: publicProcedure
    .input(InputSchema)
    .output(OutputSchema)
    .query(async ({ input }) => {
      if (process.env.API_GLOBAL_URL === undefined) throw new Error('Missing valid API_URL in .env file')
      const response = await got.get(
        `${process.env.API_GLOBAL_URL}/paradas/${input.id}/vehiculoscercanos`,
        {
          headers: { accept: 'application/json' },
          retry: { limit: 0 },
          responseType: 'json',
          cache,
          cacheOptions: {
            immutableMinTimeToLive: 1
          }
        }
      )
      if (response.statusCode === 404) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      if (response.statusCode !== 200) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      try {
        const outputData = APIResponseSchema.parse(response.body)
        const stopProcessedData: z.infer<typeof OutputSchema> = {
          name: '',
          lines: outputData.Vehiculos.map(({ Comercial, NombreLinea, Tiempo }) => ({
            color: '08748c',
            arrival_time: Tiempo.split(':')[0],
            destination: NombreLinea,
            number: Comercial
          }))
        }
        return stopProcessedData
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    })
})
