import { Button, Tooltip, TooltipAnchor, TooltipProvider } from '@ariakit/react'
import { MapPinned } from 'lucide-react'
import { getMapData } from '../hooks/getMapData'

const LocationButton: React.FC = () => {
  const { addClick, addUserCoords } = getMapData()

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        addClick()
        // setMapState(true)
        addUserCoords({ latitude, longitude })
      },
      (error) => {
        console.error('Error get user location: ', error)
      }
    )
  }

  return (
        <TooltipProvider>
            <TooltipAnchor>
                <Button onClick={getUserLocation} className="bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-semibold py-3 px-3 border border-gray-400 rounded shadow">
                    <MapPinned/>
                </Button>
            </TooltipAnchor>
            <Tooltip className="tooltip">
                <p className="bg-gray-500 text-white rounded-lg p-1 px-2 shadow" >Mi Ubicacion</p>
            </Tooltip>
        </TooltipProvider>
  )
}
export default LocationButton
