import Horario from "../Horario";
import "./horarioCompleto.css";

import { useNavigate } from "react-router-dom";

function HorarioHora({ cita }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/linea-del-tiempo", { state: { exp_num: cita.exp_num } });
  };

  return (
    <article className="horario-completo-hora">
      <strong>{cita.hora}</strong>
      <div>
        <button
          style={{
            height: "auto",
            whiteSpace: "normal",
            wordWrap: "break-word",
            padding: "4px",
          }}
          onClick={handleClick}>
          {cita.paciente.nombre} - {cita.exp_num}
        </button>
      </div>
    </article>
  );
}

function HorarioNombreDia({ dia }) {
  return (
    <article className="horario-completo-nombre-dia">
      <strong>{dia}</strong>
    </article>
  );
}

export function HorarioDia({ dia, horario }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <HorarioNombreDia dia={dia} />
      {horario.length === 0 ? (
        <HorarioNombreDia
          dia="No hay citas programadas"
          style={{ color: "red" }}
        />
      ) : (
        horario.map((horario, index) => (
          <section key={index}>
            <HorarioHora key={horario.nombre} cita={horario} />
          </section>
        ))
      )}
    </div>
  );
}

export function HorarioSemanal({ horario }) {
  return (
    <section className="horario-semanal">
      {horario.dias.map((dia, index) => (
        <HorarioDia key={dia} dia={dia} horario={horario.citas[index]} />
      ))}
    </section>
  );
}
