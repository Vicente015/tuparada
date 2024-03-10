import { fastifyCaching } from '@fastify/caching'
import cors from '@fastify/cors'
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions
} from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import { renderTrpcPanel } from 'trpc-panel'
import { z } from 'zod'
import { createContext } from './context.js'
import { appRouter, type AppRouter } from './routers/_app.js'

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  },
  production: true,
  test: false
}

const env = z.object({
  NODE_ENV: z.literal('development').or(z.literal('production'))
}).parse(process.env)

const server = fastify({
  maxParamLength: 5000,
  logger: envToLogger[env.NODE_ENV] ?? true
})

await server.register(cors, {
  origin: 'http://localhost:4321'
})
await server.register(fastifyCaching,
  {
    privacy: fastifyCaching.privacy.PUBLIC,
    expiresIn: 10,
    logLevel: env.NODE_ENV === 'production' ? 'warn' : 'debug'
  }
)

/**
 * Implementación del servidor HTTP
 * - https://trpc.io/docs/server/adapters/fastify
 */
await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    createContext,
    onError ({ error, path }) {
      // report to error monitoring
      console.error(`Error in tRPC handler on path '${path}':`, error)
    },
    router: appRouter
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions']
})

server.route({
  handler: async (request, reply) => {
    await reply
      .type('text/html')
      .send(
        renderTrpcPanel(appRouter, { url: 'http://localhost:3000/trpc' })
      )
  },
  method: 'GET',
  url: '/panel'
})

try {
  await server.listen({ port: 3000 })
  console.debug('Listening on port 3000')
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
