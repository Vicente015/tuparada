import { Button, Tooltip, TooltipAnchor, TooltipProvider } from '@ariakit/react'
import { MapPinned } from 'lucide-react'

interface LocationButtonProps {
  onLocate: () => void
}

const LocationButton: React.FC<LocationButtonProps> = ({ onLocate }) => {
  return (
        <TooltipProvider>
            <TooltipAnchor>
                <Button onClick={onLocate} className="bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-semibold py-3 px-3 border border-gray-400 rounded shadow">
                    <MapPinned/>
                </Button>
            </TooltipAnchor>
            <Tooltip className="tooltip">
                <p className="bg-gray-500 text-white rounded-lg p-1 px-2 shadow" >Mi Ubicación</p>
            </Tooltip>
        </TooltipProvider>
  )
}
export default LocationButton
