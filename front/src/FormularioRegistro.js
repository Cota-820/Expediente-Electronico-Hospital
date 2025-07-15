import React, { useState, useEffect } from "react";
import "./FormularioRegistro.css";
import DatePickerComponent from "./DatePickerComponent";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const URI = "http://localhost:3001/expedientes";
const URI_PT = "http://localhost:3001/expedientes/pacientesterapeutas";

const QCHAT_test =
  "https://docs.google.com/forms/d/e/1FAIpQLSd9SgHqVPBoTbqz5ZQ6f9UDdIAJhSfoshkgFdRUjsYv0lYsnA/viewform";
const SCQ_test =
  "https://docs.google.com/forms/d/e/1FAIpQLSfvTRcdS-ncsvY2zIhvE3x0qmlhqBQ3BeoBHoPiaWg-qHgsAw/viewform";

const CompFormularioRegistro = ({ num_tel }) => {
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
  const navigate = useNavigate();

  const store = async (e) => {
    e.preventDefault();
    const formattedDate = patientBirthdate
      ? patientBirthdate.toISOString().split("T")[0]
      : null;
    console.log(exp_num, nombre, formattedDate, numero_tel, remitido);

    try {
      await axios.post(URI, {
        exp_num: exp_num,
        nombre: nombre,
        fecha_nacimiento: formattedDate,
        numero_tel: numero_tel,
        remitido: remitido ? 1 : 0,
      });

      await axios.post(URI_PT, {
        exp_num: exp_num,
        numero_tel_terapeuta: num_tel,
      });
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al registrar el formulario. Por favor, inténtalo de nuevo.");
    }

    try {
      await axios.post(
        "http://localhost:3001/expedientes/pacienteestado/actual",
        { exp_num: exp_num, tratamiento_estado: pasoTamizaje ? 1 : 2 }
      );
    } catch (error) {
      console.error("Error al registrar:", error);
    }

    alert("Formulario registrado");
    if (pasoTamizaje) {
      navigate("/seleccionarterapeuta", {
        state: { exp_num: exp_num, num_tel },
      });
    } else {
      navigate("/");
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
              <select id="lada" name="lada" required>
                <option value="+52">+52</option>
                <option value="+1">+1</option>
                {/* Añadir más opciones de ladas según sea necesario */}
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
                onChange={(e) => setExpNum(e.target.value)}
                type="text"
                placeholder="Número de expediente"
                id="expediente"
                name="expediente"
                required
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
