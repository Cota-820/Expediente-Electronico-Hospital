import React, { useEffect, useState } from "react";
import { HorarioDia } from "./horario/horarioCompleto.js";
import axios from "axios";
import "./HorarioSemanal.css";
import Header from "./Header.js";
import {getCitasTerapeutaSemana} from "./rutasApi.js";

export default function HorarioSemanal() {
  const [horario, setHorario] = useState([]);
  const [nombreTerapeuta, setNombreTerapeuta] = useState("");
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [token] = useState(
    localStorage.getItem("token")
  );
  const [user] = useState(
    // num_tel, id, nombre, tipo
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    const fetchHorarioSemanal = async () => {
      try {
        
        const num_tel = user?.num_tel;
        // Calcula la fecha base sumando semanas
        const hoy = new Date();
        hoy.setDate(hoy.getDate() + semanaOffset * 7);
        const dia = hoy.toISOString();
        const response = await axios.post(
          getCitasTerapeutaSemana + num_tel,
          { dia: dia }
        );
        setHorario(response.data);

      } catch (error) {
        console.error("Error fetching horario semanal:", error);
      }
    };

    fetchHorarioSemanal();
  }, [semanaOffset]);

  return (
    <div className="app-container">
      <Header nombreTerapeuta={user.nombre} />
      <div className="horario-div">
        <button
          className="boton-horario-completo"
          onClick={() => setSemanaOffset(semanaOffset - 1)}
        >
          «
        </button>
        {horario.map((horario) => (
          <HorarioDia key={horario.fecha} dia={horario.dia} horario={horario.horario} />
        ))}
        <button
          className="boton-horario-completo"
          onClick={() => setSemanaOffset(semanaOffset + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
}