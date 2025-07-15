import React from "react";
import "./App.css";
import VistaPrevia from "./VistaPrevia.js";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CompFormularioRegistro from "./FormularioRegistro.js"; // Asegúrate de que la ruta sea correcta
import SeleccionarTerapeuta from "./SeleccionarPerapeuta.js";
import AgendarCita from "./AgendarCita.js";

const num_tel = "recepcionista";
const exp_num = 1111;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VistaPrevia num_tel={num_tel} />} />
        <Route
          path="/agregar-registro"
          element={<CompFormularioRegistro num_tel={num_tel} />}
        />
        <Route
          path="/seleccionarterapeuta"
          element={<SeleccionarTerapeuta exp_num={exp_num} />}
        />
        <Route
          path="/agendar-cita"
          element={<AgendarCita num_tel={num_tel} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
