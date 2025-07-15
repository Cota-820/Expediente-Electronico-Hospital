import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Paciente = ({
  nombre,
  expediente,
  tutor,
  estatus,
  onVerLinea,
  onVerEstatus,
  usuario,
}) => {
  const getStatusClass = (estatus) => {
    switch (estatus) {
      case 0:
        return PacienteFaseA;
      case 1:
        return PacienteFaseB;
      case 2:
        return PacienteFaseC;
      case 3:
        return PacienteInactivo;
      case 4:
        return PacientePendiente;
      default:
        return PacienteContainer;
    }
  };

  const getButtonHoverColor = (estatus) => {
    switch (estatus) {
      case 0:
        return "#f8dd71";
      case 1:
        return "#13b60153";
      case 2:
        return "#9da8ff";
      case 3:
        return "#ff9595";
      case 4:
        return "#999999";
      default:
        return "#13b60153";
    }
  };

  const getEstatusText = (estatus) => {
    switch (estatus) {
      case 0:
        return "Interrumpido";
      case 1:
        return "En proceso";
      case 2:
        return "Terminado";
      default:
        return "Desconocido";
    }
  };

  useEffect(() => {
    console.log("Paciente montado");
    return () => {
      console.log("Paciente desmontado");
    };
  }, []);

  const navigate = useNavigate();

  const StatusComponent = getStatusClass(estatus);
  const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #ffffff;
    color: #000;
    cursor: pointer;

    &:hover {
      background-color: ${getButtonHoverColor(estatus)};
    }
  `;

  const handlerAsignarCita = () => {
    navigate("/agendar-cita", { state: { exp_num: expediente } });
  };

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
          <Button onClick={onVerEstatus}>Ver Estatus</Button>
          {usuario === "recepcionista" ? (
            <Button onClick={handlerAsignarCita}>Asignar cita</Button>
          ) : (
            <Button onClick={onVerLinea}>Ver linea del tiempo</Button>
          )}
        </ButtonGroup>
      </InfoAndButtons>
    </StatusComponent>
  );
};

export default Paciente;

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

const PacienteFaseA = styled(PacienteContainer)`
  background-color: #fff9c0;
  border-color: #e8e4bd;
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

const PacientePendiente = styled(PacienteContainer)`
  background-color: #c3c3c3;
  border-color: #777777;
`;

const InfoAndButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
