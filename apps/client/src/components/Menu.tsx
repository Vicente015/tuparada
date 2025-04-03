import { Home, Route, Star, Ticket } from 'lucide-react'
import React from 'react'

const Menu: React.FC = () => {
  return (
        <nav
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 z-10"
    >
      <ul className="flex justify-around px-4 py-3">
        <li>
          <button
            className="flex flex-col items-center gap-1 p-2 transition hover:bg-gray-100 rounded-lg"
          >
            <Home className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Inicio</span>
          </button>
        </li>
        <li>
          <button
            className="flex flex-col items-center gap-1 p-2 transition hover:bg-gray-100 rounded-lg"
          >
            <Route className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Rutas</span>
          </button>
        </li>
        <li>
          <button
            className="flex flex-col items-center gap-1 p-2 transition hover:bg-gray-100 rounded-lg"
          >
            <Ticket className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Tarjetas</span>
          </button>
        </li>
        <li>
          <button
            className="flex flex-col items-center gap-1 p-2 transition hover:bg-gray-100 rounded-lg"
          >
            <Star className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Favoritas</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Menu
