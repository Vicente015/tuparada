import { Home, Route, Star, Ticket } from "lucide-react";
import React, { useState } from "react";

const Menu: React.FC = () => {
  const [activeItem, setActiveItem] = useState("home");

  const menuItems = [
    { id: "home", icon: Home, label: "Inicio" },
    { id: "routes", icon: Route, label: "Rutas" },
    { id: "tickets", icon: Ticket, label: "Tarjetas" },
    { id: "favorites", icon: Star, label: "Favoritas" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <nav className=" backdrop-blur-md px-2 pt-1 pb-2 shadow-lg">
        <ul className="flex justify-around max-w-md mx-auto">
          {menuItems.map((item) => (
            <li key={item.id} className="w-1/4 px-1">
              <button
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex flex-col items-center gap-1 p-2 transition ${
                  activeItem === item.id ? " rounded-2xl" : "rounded-xl"
                }`}
              >
                <item.icon
                  className={`w-6 h-6 ${
                    activeItem === item.id ? "text-blue-500" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    activeItem === item.id ? "text-blue-500" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
