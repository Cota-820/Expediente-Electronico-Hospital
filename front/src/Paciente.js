import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Paciente = ({
  nombre,
  expediente,
  tutor,
  estatus,
  usuario,
  token,
  tipo,
}) => {
  const navigate = useNavigate();

  // Asigna el color del contenedor según el nuevo estatus (string)
  const getStatusComponent = (estatus) => {
    switch (estatus) {
      case "P": return PacienteEnProceso;
      case "T": return PacienteTerminado;
      case "I": return PacienteInterrumpido;
      default:  return PacienteContainer;
    }
  };

  const getEstatusText = (estatus) => {
    switch (estatus) {
      case "P":
        return "Tratamiento en proceso";
      case "T":
        return "Tratamiento terminado";
      case "I":
        return "Tratamiento interrumpido";
      default:
        return "Desconocido";
    }
  };

  const StatusComponent = getStatusComponent(estatus);

  const handlerAsignarCita = () => {
    navigate("/agendar-cita", { state: { exp_num: expediente } });
  };

  const onVerLinea = () => {
    navigate("/linea-del-tiempo", { state: { exp_num: expediente } });
  };

  const handlerEditInfo = () => {
    navigate("/editar", {
      state: {
        exp_num: expediente
      }
    });
  }

  return (
    <StatusComponent>
      <h3>{nombre}</h3>
      <InfoAndButtons>
        <PatientInfo>
          <p>
            <strong>Expediente:</strong> {expediente}
          </p>
          <p>
            <strong>Tutor:</strong> {tutor}
          </p>
          <p>
            <strong>Estatus:</strong> {getEstatusText(estatus)}
          </p>
        </PatientInfo>
          <ButtonGroup>
            {tipo === "R" ? (
              <Button onClick={handlerAsignarCita}>Asignar cita</Button>
            ) : (
              <>
                <Button onClick={handlerEditInfo}>Editar información</Button>
                <Button onClick={onVerLinea}>Ver linea del tiempo</Button>
              </>
            )}
          </ButtonGroup>
      </InfoAndButtons>
    </StatusComponent>
  );
};

export default Paciente;



// Estilos para cada estatus
const PacienteContainer = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;

  h3 {
    margin-top: 0;
  }
`;


const PacienteEnProceso = styled(PacienteContainer)`
  background-color: #d4edda;   // verde claro
  border-color: #13b601;       // verde fuerte
`;

const PacienteTerminado = styled(PacienteContainer)`
  background-color: #e0e0ff;   // azul claro
  border-color: #4a90e2;       // azul fuerte
`;

const PacienteInterrumpido = styled(PacienteContainer)`
  background-color: #fff9c0;   // amarillo claro
  border-color: #e8e4bd;       // amarillo fuerte
`;

const PacientePendiente = styled(PacienteContainer)`
  background-color: #fff9c0;
  border-color: #e8e4bd;
`;

const PacienteFaseA = styled(PacienteContainer)`
  background-color: #f8dd71;
  border-color: #f8dd71;
`;

const PacienteFaseB = styled(PacienteContainer)`
  background-color: #d4edda;
  border-color: #c3e6cb;
`;

const PacienteFaseC = styled(PacienteContainer)`
  background-color: #e0e0ff;
  border-color: #d3d3e8;
`;

const PacienteInactivo = styled(PacienteContainer)`
  background-color: #f8d7da;
  border-color: #f5c6cb;
`;

const PacienteDiagnostico = styled(PacienteContainer)`
  background-color: #e0f7fa;
  border-color: #b2ebf2;
`;

const InfoAndButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
`;
const PatientInfo = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;

  p {
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #ffffff;
  color: #000;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;