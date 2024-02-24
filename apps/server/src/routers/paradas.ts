import { TRPCError } from '@trpc/server'
import { readFile, readFileSync } from 'fs'
import got from 'got'
import { z } from 'zod'
// import cacheStorage from '../cache.js'
import Constants from '../Constants.js'
import { publicProcedure, router } from '../trpc.js'

const cacheStorage = new Map()

const minutesType = z.custom<`${number}min`>((val) => {
  return typeof val === 'string' ? /^\d+min$/.test(val) : false
})

const inputSchema = z.object({
  id: z.number().int().min(1).max(999)
})

const paradaSchema = z.object({
  nombre: z.string(),
  lineas: z.array(z.object({
    destino: z.string(),
    llegada: z.string(),
    numero: z.coerce.number()
  }))
})

const paradasSchema = z.array(z.object({
  nombre: z.string(),
  numero: z.string()
}))

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
          retry: { limit: 0 },
          cache: cacheStorage,
          cacheOptions: {
            shared: true,
            immutableMinTimeToLive: 24 * 3600 * 100
          }
        }
      )

      if (response.statusCode === 404) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      if (response.statusCode !== 200) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      console.debug(response.isFromCache)

      try {
        // TODO: Podría añadir la ubicación de la parada con los datos de transit
        const data = paradaSchema.parse(response.body)
        console.debug('data', data)
        return { id, ...data }
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    }),
  list: publicProcedure
    .query(async () => {
      const path = new URL('src/data/paradas.json', import.meta.url)
      const file = readFileSync(path, { encoding: 'utf-8' })
      console.log(path, file)
      return JSON.parse(file) as z.infer<typeof paradasSchema>

      /* const response = await got.get(
      `${Constants.API_URL}/paradas`,
      {
        headers: { accept: 'application/json' },
        retry: { limit: 0 },
        responseType: 'json',
        cache: cacheStorage,
        cacheOptions: {
          shared: true,
          immutableMinTimeToLive: 24 * 3600 * 100
        }
      }
    )

  console.debug('cache', response.isFromCache, cacheStorage)

  if (response.statusCode === 404) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }
  if (response.statusCode !== 200) {
    throw new TRPCError({ code: 'BAD_REQUEST' })
  }
  if (!Array.isArray(response.body)) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
  }

  try {
    const body = paradasSchema.parse(response.body)
    // Remove the first template/guide element
    body.shift()
    // Get the next template element to avoid using magic numbers
    const end = body.findIndex((stop) => stop.numero === 'PAR')
    const data = paradasSchema.parse(body.slice(0, end))
    // Convert 'numero' to number
    return data.map(({ nombre, numero }) => ({ nombre, numero: parseInt(numero) }))
  } catch (err) {
    console.error(err)
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
  } */
    })
})
