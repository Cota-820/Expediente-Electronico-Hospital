import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import logo from "./public/LogoOficial_HIC_horizontal.png"; // Ajusta la ruta del logo según tu proyecto
import DatePickerComponent from "./DatePickerComponent";
import { useNavigate, useLocation } from "react-router-dom";

const AgendarCita = () => {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [date, setDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [citaId, setCitaId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { exp_num } = location.state || {};

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const citaResponse = await axios.get(
          `http://localhost:3001/expedientes/cita/sinfecha/sinhora/${exp_num}`
        );

        const cita = citaResponse.data[0];
        setCitaId(cita.cita_id);

        if (cita.numero_tel_terapeuta === "NA") {
          const respuesta = await axios.get(
            "http://localhost:3001/expedientes/terapeutas/A"
          );
          setTherapists(respuesta.data);
        } else if (cita.numero_tel_terapeuta) {
          const respuesta = await axios.get(
            `http://localhost:3001/expedientes/terapeuta/${cita.numero_tel_terapeuta}`
          );
          setTherapists([respuesta.data]);
        } else {
          console.error("El campo numero_tel_terapeuta es undefined");
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
            `http://localhost:3001/expedientes/citas/${selectedTherapist}`
          );

          const citasDelDia = response.data.filter(
            (cita) => cita.fecha === formattedDate
          );
          const bookedSlots = citasDelDia.map((cita) => cita.hora);

          const allSlots = Array.from(
            { length: 10 },
            (_, i) => `${8 + i}:00:00`
          );

          const availableSlots = allSlots.filter(
            (slot) => !bookedSlots.includes(slot)
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
      alert("Por favor completa todos los campos.");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];

    if (!citaId) {
      alert("Error: ID de la cita no encontrado.");
      return;
    }

    const payload = {
      exp_num,
      numero_tel_terapeuta: selectedTherapist,
      fecha: formattedDate,
      hora: selectedTime,
    };

    try {
      await axios.put(
        `http://localhost:3001/expedientes/agendar-cita/${citaId}`,
        payload
      );
      alert("Cita agendada con éxito.");
      navigate("/");
    } catch (error) {
      console.error("Error agendando la cita:", error);
      alert("Hubo un problema al agendar la cita. Intenta nuevamente.");
    }
  };

  const today = new Date();
  const maxDate = new Date(today.setMonth(today.getMonth() + 2));

  return (
    <div>
      <Header>
        <LogoContainer>
          <Logo src={logo} alt="Hospital Logo" />
        </LogoContainer>
        <LogoutButton>Cerrar Sesión</LogoutButton>
      </Header>
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
const Header = styled.div`
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
`;

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
