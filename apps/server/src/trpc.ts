import { initTRPC } from '@trpc/server'

const t = initTRPC.create({
  isDev: true
})

export const router = t.router
export const publicProcedure = t.procedure
