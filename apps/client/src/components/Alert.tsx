import { AlertCircle } from 'lucide-react'

const Alert = () => {
  return (
    <section className="hidden mt-4 text-[12px]">
      <div className="flex p-3.5 bg-amber-50 border-l-4 border-amber-400 rounded-md items-center space-x-3 shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-amber-800">
              Aviso de incidencia
            </h3>
            <span className=" text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              Activo
            </span>
          </div>
          <p className="mt-1 text-amber-700 leading-tight">
            Las líneas 1, 12 están afectadas por obras en la zona
          </p>
        </div>
      </div>
    </section>
  )
}

export default Alert
