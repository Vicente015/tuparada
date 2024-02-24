import { fastifyCaching } from '@fastify/caching'
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions
} from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import { renderTrpcPanel } from 'trpc-panel'
import { createContext } from './context.js'
import { appRouter, type AppRouter } from './routers/_app.js'

const server = fastify({
  maxParamLength: 5000
})

/* await server.register(fastifyCaching,
  {
    privacy: fastifyCaching.privacy.PUBLIC,
    expiresIn: 5000
  }
)
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
