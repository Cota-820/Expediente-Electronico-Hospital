import React from "react";
import Paciente from "./Paciente";

const ListaExpedientes = ({ pacientes, usuario, token, tipo }) => {
  return (
    <main className="main">
      <div className="patient-list">
        {pacientes.length > 0 ? (
          pacientes.map((paciente, index) => (
            <Paciente
              key={index}
              nombre={paciente.nombre}
              expediente={paciente.exp_num}
              tutor={paciente.numero_tel}
              estatus={paciente.estatus}
              usuario={usuario}
              token={token}
              tipo={tipo}
            />
          ))
        ) : (
          <p>No hay pacientes asignados</p>
        )}
      </div>
    </main>
  );
};

export default ListaExpedientes;
