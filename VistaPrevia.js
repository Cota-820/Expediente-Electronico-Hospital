import React, { useState, useEffect } from "react";
import "./VistaPrevia.css";
import Horario from "./Horario";
import Filtrado from "./Filtrado";
import ListaExpedientes from "./ListaExpedientes";
import Header from "./Header";
import axios from "axios";

const citas = [
  { hora: "09:00 - 10:00", paciente: "Paciente A" },
  { hora: "11:00 - 12:00", paciente: "Paciente B" },
  { hora: "14:00 - 15:00", paciente: "Paciente C" },
];

function VistaPrevia({ num_tel }) {
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [nombreTerapeuta, setNombreTerapeuta] = useState("");

  useEffect(() => {
    const fetchPacientes = async () => {
      if (num_tel !== "recepcionista") {
        try {
          const response = await axios.get(
            `http://localhost:3001/expedientes/vistaprevia/${num_tel}`
          );
          if (Array.isArray(response.data.pacientes)) {
            setPacientes(response.data.pacientes);
            setPacientesFiltrados(response.data.pacientes);
            setNombreTerapeuta(response.data.terapeuta.nombre);
          } else {
            console.error(
              "La respuesta no es un array:",
              response.data.pacientes
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        try {
          const response = await axios.get(
            `http://localhost:3001/expedientes//citas/sinfecha/sinhora`
          );
          if (Array.isArray(response.data)) {
            setPacientes(response.data);
          } else {
            console.error(
              "La respuesta no es un array:",
              response.data.pacientes
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchPacientes();
  }, []);

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log("Cerrar sesión");
  };

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} nombreTerapeuta={nombreTerapeuta} />
      <div className="main-content">
        <div className="left-section">
          <Horario citas={citas} />
        </div>
        <div className="center-section">
          <ListaExpedientes pacientes={pacientesFiltrados} usuario={num_tel} />
        </div>
        <div className="right-section">
          <Filtrado
            onFilteredPatients={setPacientesFiltrados}
            pacientes={pacientes}
            numero_tel={num_tel}
          />
        </div>
      </div>
    </div>
  );
}

export default VistaPrevia;
