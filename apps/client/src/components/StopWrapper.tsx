import 'react-loading-skeleton/dist/skeleton.css'
import { SkeletonTheme } from 'react-loading-skeleton'
import Stop from './Stop.jsx'
import Wrapper from './Wrapper.jsx'

const StopWrapper = ({ stop }: { stop: number }) => {
  return (
    <Wrapper>
      <SkeletonTheme baseColor='#d4d4d8' highlightColor='#a3a3a3'>
        <Stop stop={stop} />
      </SkeletonTheme>
    </Wrapper>
  )
}
export default StopWrapper
