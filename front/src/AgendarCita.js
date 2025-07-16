import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import DatePickerComponent from "./DatePickerComponent";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header.js";
import { message } from "antd";

import { getTerapeutasDePaciente } from "./rutasApi.js";
const BASE_URL = "http://localhost:3001/expedientes";

const ENDPOINTS = {
  getCitaSinFecha: (exp_num) => `${BASE_URL}/cita/sinfecha/sinhora/${exp_num}`,
  getUsuariosByTipo: (tipo) => `${BASE_URL}/usuarios/tipo/${tipo}`,
  getUsuarioByTel: (numero_tel) => `${BASE_URL}/usuarios/${numero_tel}`,
  getCitasByTherapist: (numero_tel) => `${BASE_URL}/citas/${numero_tel}`,
  agendarCita: (citaId) => `${BASE_URL}/agendar-cita/${citaId}`,
};

const AgendarCita = () => {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [date, setDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [citaId, setCitaId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const exp_num = location.state?.exp_num;

  const [user] = useState(() => JSON.parse(localStorage.getItem("user")) || {});
  const numero_tel = user?.num_tel;
  const token = localStorage.getItem("token");
  const tipo_usuario = user?.tipo;

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const citaResponse = await axios.get(
          ENDPOINTS.getCitaSinFecha(exp_num)
        );
        const cita = citaResponse.data[0];
        setCitaId(cita.cita_id);

        // Obtener estado y etapa del paciente
        const pacienteResponse = await axios.get(
          getTerapeutasDePaciente(exp_num)
        );

        const paciente = pacienteResponse.data;

        if (paciente.estado === "T" || cita.etapa === "D") {
          // Opción 2: Todos los terapeutas que tuvieron citas con el paciente
          const resp = await axios.get(getTerapeutasDePaciente(exp_num));
          setTherapists(resp.data);
        } else if (cita.numero_tel_terapeuta === null) {
          const respuesta = await axios.get(
            ENDPOINTS.getUsuariosByTipo(cita.etapa)
          );
          setTherapists(respuesta.data.usuarios);
        } else if (cita.numero_tel_terapeuta) {
          const respuesta = await axios.get(
            ENDPOINTS.getUsuarioByTel(cita.numero_tel_terapeuta)
          );
          setTherapists([respuesta.data]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPacientes();
  }, [exp_num]);

  useEffect(() => {
    const formattedDate = date ? date.toISOString().split("T")[0] : null;

    if (selectedTherapist && formattedDate) {
      const fetchTimeSlots = async () => {
        try {
          const response = await axios.get(
            ENDPOINTS.getCitasByTherapist(selectedTherapist)
          );
          const citasDelDia = response.data.filter(
            (cita) => cita.fecha === formattedDate
          );
          const bookedSlots = citasDelDia.map((cita) => cita.hora);

          const allSlots = Array.from(
            { length: 10 },
            (_, i) => `${String(8 + i).padStart(2, "0")}:00:00`
          );

          const bookedSlotsNormalized = bookedSlots.map((slot) =>
            slot.length === 7 ? `0${slot}` : slot
          );

          const availableSlots = allSlots.filter(
            (slot) => !bookedSlotsNormalized.includes(slot)
          );

          setTimeSlots(availableSlots);
        } catch (error) {
          console.error("Error al obtener horarios:", error);
        }
      };

      fetchTimeSlots();
    }
  }, [selectedTherapist, date]);

  const handleSchedule = async (event) => {
    event.preventDefault();

    if (!selectedTherapist || !date || !selectedTime) {
      message.error("Por favor completa todos los campos.");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];

    if (!citaId) {
      message.error("Error: ID de la cita no encontrado.");
      return;
    }

    const payload = {
      exp_num,
      numero_tel_terapeuta: selectedTherapist,
      fecha: formattedDate,
      hora: selectedTime,
    };

    try {
      await axios.put(ENDPOINTS.agendarCita(citaId), payload);
      message.success("Cita agendada con éxito.");

      navigate("/", {
        state: {
          num_tel: numero_tel,
          token: token,
          user: user,
          tipo_usuario: tipo_usuario,
        },
      });
    } catch (error) {
      console.error("Error agendando la cita:", error);
      message.error("Hubo un problema al agendar la cita. Intenta nuevamente.");
    }
  };

  const today = new Date();
  const maxDate = new Date(today.setMonth(today.getMonth() + 2));

  return (
    <div>
      <Header
        num_tel={numero_tel}
        token={token}
        user={user}
        tipo_usuario={tipo_usuario}
        nombreTerapeuta={user?.nombre}
      />
      <AppointmentContainer>
        <h1>Agendar Cita</h1>
        <FormGroup>
          <label>Selecciona un Terapeuta:</label>
          <select onChange={(e) => setSelectedTherapist(e.target.value)}>
            <option value="">--Selecciona--</option>
            {therapists.map((therapist) => (
              <option key={therapist.numero_tel} value={therapist.numero_tel}>
                {therapist.nombre}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label htmlFor="fechaCita">Selecciona una Fecha:</label>
          <DatePickerComponent
            selectedDate={date}
            onDateChange={setDate}
            placeholder="día/mes/año"
            minDate={new Date()}
            maxDate={maxDate}
          />
        </FormGroup>
        {date && (
          <FormGroup>
            <label>Selecciona un Horario:</label>
            <select onChange={(e) => setSelectedTime(e.target.value)}>
              <option value="">--Selecciona--</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {timeSlots.length === 0 && <p>No hay horarios disponibles.</p>}
          </FormGroup>
        )}
        <Button onClick={handleSchedule}>Confirmar Cita</Button>
      </AppointmentContainer>
    </div>
  );
};

export default AgendarCita;

// Estilos CSS con styled-components
/*const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
`;

const LogoutButton = styled.button`
  border: 1px solid red;
  color: red;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 0, 0, 0.2);
  }
`;*/

const AppointmentContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
