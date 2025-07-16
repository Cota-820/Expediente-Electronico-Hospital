import React from "react";
//import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import VistaPrevia from "./VistaPrevia.js";
import CompFormularioRegistro from "./FormularioRegistro.js";
import SeleccionarTerapeuta from "./SeleccionarTerapeuta.js";
import AgendarCita from "./AgendarCita.js";

import LoginView from "./Login/LoginView.js";
import ForgotPassword from "./Login/ForgotPassword.js";

import Admin from "./Dashboard/layouts/Admin.js";

import Settings from "./Dashboard/views/Settings.js";

import LineaDelTiempo from "./linea/LineaDelTiempo.js";
import HorarioSemanal from "./HorarioSemanal.js";

import EditCompFormularioRegistro from "./EditFormularioRegistro.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VistaPrevia />} />
        <Route
          path="/ajustes"
          element={
            <div className="flex items-center justify-center min-h-screen ">
              <div className="w-9/12 max-w-xl">
                <Settings />
              </div>
            </div>
          }
        />
        <Route path="/agregar-registro" element={<CompFormularioRegistro />} />
        <Route
          path="/seleccionarterapeuta"
          element={<SeleccionarTerapeuta />}
        />
        <Route path="/agendar-cita" element={<AgendarCita />} />
        <Route path="/login-sign-in-up" element={<LoginView />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/admin/*" element={<Admin />} />
        <Route path="/linea-del-tiempo" element={<LineaDelTiempo />} />
        <Route path="/ver-horario" element={<HorarioSemanal />} />
        <Route
          path="/editar"
          element={<EditCompFormularioRegistro />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
