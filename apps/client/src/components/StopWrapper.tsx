import Stop from './Stop.jsx'
import Wrapper from './Wrapper.jsx'

const StopWrapper = ({ stop }: { stop: number }) => {
  return (
    <Wrapper>
      <Stop stop={stop}/>
    </Wrapper>
  )
}
export default StopWrapper
