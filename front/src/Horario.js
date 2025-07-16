import { HorarioDia } from "./horario/horarioCompleto.js";
import React, { useState } from "react";
import "./Horario.css";
import { useNavigate, useLocation } from "react-router-dom";

const Horario = ({ citas }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token] = useState(
    location.state?.token || localStorage.getItem("token")
  );
  const [user] = useState(
    // num_tel, id, nombre, tipo
    JSON.parse(localStorage.getItem("user"))
  );

  const handler = () => {
    navigate("/ver-horario");
  };

  return (
    <div className="horario-container">
      <HorarioDia dia={citas.dia} horario={citas.horario} />
      <button onClick={handler} className="boton-horario-completo">
        Ver horario completo
      </button>
    </div>
  );
};

export default Horario;
