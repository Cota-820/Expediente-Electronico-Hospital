import React from "react";
import "./Horario.css";

const Horario = ({ citas }) => {
  return (
    <div className="horario-container">
      <h2>Horario: </h2>
      {citas.map((cita, index) => (
        <div key={index} className="cita">
          <span className="hora">{cita.hora}</span>
          <span className="paciente">{" " + cita.paciente}</span>
        </div>
      ))}
    </div>
  );
};

export default Horario;
