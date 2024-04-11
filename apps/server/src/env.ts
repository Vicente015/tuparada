import { z } from 'zod'

const env = z.object({
  NODE_ENV: z.literal('development').or(z.literal('production'))
}).parse(process.env)

export default env
