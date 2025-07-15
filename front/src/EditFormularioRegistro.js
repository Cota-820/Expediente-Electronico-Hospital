import React, { useState, useEffect } from "react";
import "./FormularioRegistro.css";
import DatePickerComponent from "./DatePickerComponent";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const QCHAT_test =
  "https://docs.google.com/forms/d/e/1FAIpQLSd9SgHqVPBoTbqz5ZQ6f9UDdIAJhSfoshkgFdRUjsYv0lYsnA/viewform";
const SCQ_test =
  "https://docs.google.com/forms/d/e/1FAIpQLSfvTRcdS-ncsvY2zIhvE3x0qmlhqBQ3BeoBHoPiaWg-qHgsAw/viewform";

const EditCompFormularioRegistro = () => {
  const URI = "http://localhost:3001/expedientes/" + useParams().exp_num;

  const [patientBirthdate, setPatientBirthdate] = useState("");
  const [remitidoOtroHospital, setRemitidoOtroHospital] = useState("");
  const [noNecesitaPruebas, setNoNecesitaPruebas] = useState("");
  const [showQCHAT, setShowQCHAT] = useState(false);
  const [showSCQ, setShowSCQ] = useState(false);

  const [nombre, setNombre] = useState("");
  const [exp_num, setExp_num] = useState("");
  const [numero_tel, setNumero_tel] = useState("");
  const [remitido, setRemitido] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    display();
  }, []);

  const display = async (e) => {
    const data = await axios.get(URI);
    setNombre(data.data.nombre);
    setExp_num(data.data.exp_num);
    setNumero_tel(data.data.numero_tel);
    setPatientBirthdate(new Date(data.data.fecha_nacimiento));
    setRemitido(data.data.remitido ? true : false);
    setRemitidoOtroHospital(data.data.remitido ? true : false);
  };

  const manejarCambioRemitido = (event) => {
    setRemitido(event.target.checked);
    setRemitidoOtroHospital(!remitidoOtroHospital);

    if (!remitidoOtroHospital === false) {
      setNoNecesitaPruebas(false);
    }
  };

  const manejarCambioNoNecesitaPruebas = () => {
    if (remitidoOtroHospital) {
      setNoNecesitaPruebas(!noNecesitaPruebas);
    }
  };

  const store = async (e) => {
    e.preventDefault();
    const formattedDate = patientBirthdate
      ? patientBirthdate.toISOString().split("T")[0]
      : null;
    console.log(exp_num, nombre, formattedDate, numero_tel, remitido);
    await axios.put(URI, {
      exp_num: exp_num,
      nombre: nombre,
      fecha_nacimiento: formattedDate,
      numero_tel: numero_tel,
      remitido: remitido ? 1 : 0,
    });
    alert("Formulario actualizado");
    navigate("/edit/");
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
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo"
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
                onChange={(e) => setNumero_tel(e.target.value)}
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
                onChange={(e) => setExp_num(e.target.value)}
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
                checked={remitido}
                type="checkbox"
                id="remitido"
                name="remitido"
                value={remitido}
                onChange={(e) => manejarCambioRemitido(e)}
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

export default EditCompFormularioRegistro;
