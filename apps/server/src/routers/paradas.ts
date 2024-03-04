import { TRPCError } from '@trpc/server'
import got from 'got'
import { z } from 'zod'
import Constants from '../Constants.js'
import { publicProcedure, router } from '../trpc.js'
import getRouteColor from '../utils/getRouteColor.js'

// const minutesType = z.custom<`${number}min`>((val) => {
//   return typeof val === 'string' ? /^\d+min$/.test(val) : false
// })

const inputSchema = z.object({
  id: z.number().int().min(1).max(999)
})

const paradaSchema = z.object({
  nombre: z.string(),
  lineas: z.array(z.object({
    destino: z.string(),
    llegada: z.string(),
    numero: z.string(),
    color: z.string().optional()
  }))
})

// const paradasSchema = z.array(z.object({
//   id: z.string(),
//   name: z.string(),
//   latitude: z.string(),
//   longitude: z.string()
// }))

export const paradasRouter = router({
  get: publicProcedure
    .input(inputSchema)
    .output(paradaSchema.merge(inputSchema))
    .mutation(async (opts) => {
      const { input: { id } } = opts

      const response = await got.get(
        `${Constants.API_URL}/parada/${id}`,
        {
          headers: { accept: 'application/json' },
          responseType: 'json',
          retry: { limit: 1 }
        }
      )

      if (response.statusCode === 404) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      if (response.statusCode !== 200) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      try {
        // TODO: Podría añadir la ubicación de la parada con los datos de transit
        const data = paradaSchema.parse(response.body)
        const routesWithColor = data.lineas.map(({ color, ...propiedades }) => ({
          color: getRouteColor(propiedades.numero),
          ...propiedades
        }))
        data.lineas = routesWithColor
        return { id, ...data }
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    })
})
