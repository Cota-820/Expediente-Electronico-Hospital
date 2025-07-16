import React, { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [token] = useState(
    location.state?.token || localStorage.getItem("token")
  );
  const [user] = useState(
    location.state?.user || JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    if (!token || !user) {
      navigate("/login-sign-in-up");
      return;
    }

    // Cierre de sesión por inactividad
    const handleInactivity = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login-sign-in-up");
    };

    // Temporizador inactividad 1 min = 60000 ms
    const inactivityTimeout = 3600000;
    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(handleInactivity, inactivityTimeout);
    };

    // Eventos para resetear el temporizador
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    // Limpiar al desmontar el componente
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [token, user, navigate]);

  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href=""
            onClick={(e) => e.preventDefault()}>
            Dashboard
          </a>
          <a className="text-white text-sm uppercase hidden lg:inline-block font-semibold">
            Bienvenid@, {user?.nombre}
          </a>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
