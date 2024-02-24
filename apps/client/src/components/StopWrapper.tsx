import Stop from './Stop'
import Wrapper from './Wrapper'

const StopWrapper = ({ stop }: { stop: number }) => {
  return (
    <Wrapper>
      <Stop stop={stop}/>
    </Wrapper>
  )
}
export default StopWrapper
