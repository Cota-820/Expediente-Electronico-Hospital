import React, { useState, useEffect } from "react";
import "./VistaPrevia.css";
import Horario from "./Horario";
import Filtrado from "./Filtrado";
import ListaExpedientes from "./ListaExpedientes";
import Header from "./Header";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getTerapeutaWithPatients, getCitasTerapeutaDia, getCitasSinFechaNiHora, getCitas } from "./rutasApi.js";

var citas = { dia: "", horario: [] };

function VistaPrevia() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [nombreTerapeuta, setNombreTerapeuta] = useState("");
  const [token] = useState(
    location.state?.token || localStorage.getItem("token")
  );
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user") {
        const updatedUser = JSON.parse(event.newValue);
        setUser(updatedUser);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  // Verificar autenticación al cargar el componente
  useEffect(() => {
    if (!token || !user) {
      navigate("/login-sign-in-up");
      return;
    }

    // Configurar axios para enviar el token en las peticiones
    //axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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

  useEffect(() => {
    const fetchPacientes = async () => {
      if (!user) return; // Validar usuario definido

      console.log("user", user);
      console.log("user.tipo", user.tipo);
      console.log("user.num_tel", user.num_tel);

      if (user.tipo !== "R") {
        try {
          const response = await axios.get(
            getTerapeutaWithPatients + user.num_tel
          );
          if (Array.isArray(response.data.pacientes)) {
            setPacientes(response.data.pacientes);
            setPacientesFiltrados(response.data.pacientes);
            setNombreTerapeuta(response.data.usuario.nombre);
          } else {
            console.error(
              "La respuesta no es un array:",
              response.data.pacientes
            );
          }

          const citas_resp = await axios.get(
            getCitasTerapeutaDia + user.num_tel
          );
          console.log("Citas", citas_resp.data);
          const dia =
            new Date().toLocaleDateString("es-MX", { weekday: "long" }) +
            " " +
            new Date().getDate() +
            " de " +
            new Date().toLocaleDateString("es-MX", { month: "long" });
          if (Array.isArray(citas_resp.data)) {
            citas_resp.data.sort((a, b) => {
              const [ah, am] = a.hora.split(":").map(Number);
              const [bh, bm] = b.hora.split(":").map(Number);
              return ah !== bh ? ah - bh : am - bm;
            });
          }
          citas = { dia: dia, horario: citas_resp.data };
        } catch (error) {
          console.error("Error fetching data:", error);
          if (error.response?.status === 401) {
            // Token inválido o expiro
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login-sign-in-up");
          }
        }
      } else {
        try {
          const response = await axios.get(
            getCitas
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
  }, [user, navigate]);

  useEffect(() => { 
    console.log("Pacientes Filtrados:", pacientesFiltrados);
  }, [pacientesFiltrados]);

  return (
    <div className="app-container">
      <Header
        num_tel={user?.num_tel}
        token={token}
        user={user}
        tipo_usuario={user?.tipo}
        nombreTerapeuta={user?.nombre}
      />
      <div className="main-content">
        {user?.tipo !== "R" && (
          <div className="left-section">
            <h1> Horario </h1>
            <Horario citas={citas} />
          </div>
        )}
        <div className="center-section">
          <h1> Pacientes Asignados </h1>
          <ListaExpedientes
            pacientes={pacientesFiltrados}
            usuario={user}
            token={token}
            tipo={user?.tipo}
          />
        </div>
        <div className="right-section">
          <Filtrado
            onFilteredPatients={setPacientesFiltrados}
            pacientes={pacientes}
            num_tel={user?.num_tel}
            token={token}
            tipo_usuario={user?.tipo}
          />
        </div>
      </div>
    </div>
  );
}

export default VistaPrevia;
