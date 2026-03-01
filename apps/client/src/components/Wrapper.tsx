import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { type PropsWithChildren, useState } from 'react'
import { trpc } from '../utils/trpc'

const isProd = import.meta.env.PROD

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: (isProd ? 'https://apituparada.vicente015.dev' : 'http://localhost:3000') + '/trpc'
        })
      ]
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
export default Wrapper
