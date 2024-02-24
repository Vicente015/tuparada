import '@trpc/server'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from 'server/src/routers/_app'

/**
 * Based on the following documentation:
 * @link https://trpc.io/docs/v10/client/react/setup
 * @link https://www.thomasledoux.be/blog/using-trpc-astro-islands-react
 */
export const trpc = createTRPCReact<AppRouter>()
