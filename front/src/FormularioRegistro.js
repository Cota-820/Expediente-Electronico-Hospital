import React, { useState, useEffect } from "react";
import "./FormularioRegistro.css";
import DatePickerComponent from "./DatePickerComponent";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

import {
  QCHAT_test,
  SCQ_test,
  createPacientesTerapeutas,
  createExpediente,
  createPacienteEstado,
} from "./rutasApi.js";

const CompFormularioRegistro = () => {
  const [patientBirthdate, setPatientBirthdate] = useState("");
  const [remitidoOtroHospital, setRemitidoOtroHospital] = useState(false);
  const [noNecesitaPruebas, setNoNecesitaPruebas] = useState(false);
  const [showQCHAT, setShowQCHAT] = useState(false);
  const [showSCQ, setShowSCQ] = useState(false);

  const [pasoTamizaje, setPasoTamizaje] = useState(false);

  const [exp_num, setExpNum] = useState("");
  const [nombre, setNombre] = useState("");
  const [numero_tel, setNumeroTel] = useState("");
  const [remitido, setRemitido] = useState(false);

  const [lada, setLada] = useState("52");

  const navigate = useNavigate();
  const location = useLocation();

  const [token] = useState(localStorage.getItem("token"));
  const [user] = useState(
    // user.num_tel, id, nombre, tipo
    JSON.parse(localStorage.getItem("user"))
  );

  const store = async (e) => {
    e.preventDefault();
    const formattedDate = patientBirthdate
      ? patientBirthdate.toISOString().split("T")[0]
      : null;

    const numeroTelCompleto = lada + numero_tel;

    try {
      console.log("Expediente:", exp_num);
      console.log("Nombre:", nombre);
      console.log("Fecha de nacimiento:", formattedDate);
      console.log("Número telefónico:", numeroTelCompleto);
      console.log("Remitido:", remitido ? 1 : 0);

      await axios.post(createExpediente, {
        exp_num: exp_num,
        nombre: nombre,
        fecha_nacimiento: formattedDate,
        numero_tel: numeroTelCompleto,
        remitido: remitido ? 1 : 0,
      });

      await axios.post(createPacientesTerapeutas, {
        exp_num: exp_num,
        numero_tel_terapeuta: user.num_tel,
      });

      await axios.post(createPacienteEstado, {
        exp_num: exp_num,
        estado: pasoTamizaje ? "P" : "T",
      });

      message.success("Formulario registrado");

      if (pasoTamizaje) {
        navigate("/seleccionarterapeuta", {
          state: {
            exp_num: exp_num,
            num_tel: user.num_tel,
            tipo: "A",
          },
        });
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      message.error(
        "Error al registrar el formulario. Por favor, inténtalo de nuevo. \nAsegurate de que el número de expediente no esté repetido."
      );
    }
  };

  useEffect(() => {
    if (patientBirthdate) {
      const ageInMonths =
        (new Date().getFullYear() - patientBirthdate.getFullYear()) * 12 +
        (new Date().getMonth() - patientBirthdate.getMonth());
      setShowQCHAT(ageInMonths < 48); // Menos de 4 años (48 meses)
      setShowSCQ(ageInMonths >= 48); // 4 años o más
    }
  }, [patientBirthdate]);

  const manejarCambioRemitido = (event) => {
    setRemitido(event.target.checked);
    setRemitidoOtroHospital(event.target.checked);

    if (!event.target.checked) {
      setNoNecesitaPruebas(false);
    }
  };

  const manejarCambioNoNecesitaPruebas = () => {
    if (remitidoOtroHospital) {
      setNoNecesitaPruebas(!noNecesitaPruebas);
    }
  };

  const manejarCambioPasoTamizaje = (e) => {
    setPasoTamizaje(e.target.checked);
  };

  const today = new Date();
  const minDate = new Date(today.setFullYear(today.getFullYear() - 18));

  console.log("user.num_tel", user.num_tel);

  return (
    <div className="formulario-page">
      <header className="header">
        <img
          src="/LogoOficial_HIC_horizontal.png"
          className="logo"
          alt="Logo Oficial HIC"
        />
        <h1 data-text="Formulario de Registro de Pacientes">
          Formulario de Registro de Pacientes
        </h1>
      </header>

      <div className="formulario-container">
        <form onSubmit={store}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre del paciente:</label>
            <input
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              type="text"
              id="nombre"
              name="nombre"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefonoTutor">Número telefónico del tutor:</label>
            <div className="telefono-container">
              <select
                id="lada"
                name="lada"
                required
                value={lada}
                onChange={(e) => setLada(e.target.value)}>
                <option value="52">52</option>
                <option value="1">1</option>
                {/* Añadir más ladas si es necesario */}
              </select>
              <input
                value={numero_tel}
                onChange={(e) => setNumeroTel(e.target.value)}
                type="tel"
                id="telefonoTutor"
                placeholder="Número telefónico"
                name="telefonoTutor"
                required
                pattern="[0-9]+"
                maxLength="10"
                title="Ingrese solo números"
              />
            </div>
          </div>

          <div className="form-group fecha-expediente">
            <div className="field-half">
              <label htmlFor="fechaNacimiento">Fecha de nacimiento:</label>
              <DatePickerComponent
                selectedDate={patientBirthdate}
                onDateChange={setPatientBirthdate}
                placeholder="dia/mes/año"
                minDate={minDate}
                maxDate={new Date()}
              />
            </div>

            <div className="field-half">
              <label htmlFor="expediente">Número de expediente:</label>
              <input
                value={exp_num}
                onChange={(e) => setExpNum(e.target.value.replace(/\D/, ""))} // Solo números
                type="number"
                placeholder="Número de expediente"
                id="expediente"
                name="expediente"
                required
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>

          <div className="form-group checkbox">
            <label htmlFor="remitido">
              <input
                type="checkbox"
                id="remitido"
                name="remitido"
                checked={remitido}
                onChange={manejarCambioRemitido}
              />
              Remitido de otro hospital
            </label>
          </div>

          <div className="form-group checkbox">
            <label htmlFor="noNecesitaPruebas">
              <input
                type="checkbox"
                id="noNecesitaPruebas"
                name="noNecesitaPruebas"
                onChange={manejarCambioNoNecesitaPruebas}
                disabled={!remitidoOtroHospital}
                checked={noNecesitaPruebas}
              />
              No necesita pruebas
            </label>
          </div>

          <div className="form-group checkbox">
            <label htmlFor="pasoTamizaje">
              <input
                type="checkbox"
                id="pasoTamizaje"
                name="pasoTamizaje"
                value={pasoTamizaje}
                onChange={(e) => manejarCambioPasoTamizaje(e)}
              />
              Pasó tamizaje
            </label>
          </div>

          <button type="submit" className="btn-registrar">
            Registrar
          </button>
        </form>

        {!noNecesitaPruebas && (showQCHAT || showSCQ) && (
          <div className="pruebas-container">
            <h3>Pruebas disponibles</h3>
            {showQCHAT && (
              <a href={QCHAT_test} target="_blank" rel="noopener noreferrer">
                Prueba Q-CHAT
              </a>
            )}
            {showSCQ && (
              <a href={SCQ_test} target="_blank" rel="noopener noreferrer">
                Prueba SCQ
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompFormularioRegistro;
