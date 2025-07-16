import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { createPrimeraCita, getUsuariosByTipo } from "./rutasApi.js";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "./Header.js";

const SeleccionarTerapeuta = () => {
  const [therapists, setTherapists] = useState([]);
  const [numero_tel_terapeuta, setNumeroTel] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const exp_num = location.state?.exp_num;
  const tipo = location.state?.tipo;
  const token = localStorage.getItem("token");

  useEffect(() => {
    setNumeroTel(user.numero_tel);
    axios
      .get(getUsuariosByTipo + tipo)
      .then((response) => setTherapists(response.data.usuarios))
      .catch((error) => console.error("Error fetching therapists:", error));
  }, []);

  const handleSeleccionarTerapeuta = async (event) => {
    event.preventDefault();
    const terapeutaAsignado =
      numero_tel_terapeuta === "NA" ? null : numero_tel_terapeuta;

    try {
      const response = await axios.post(createPrimeraCita, {
        exp_num: exp_num,
        numero_tel_terapeuta: terapeutaAsignado,
        tipo: tipo,
      });

      navigate("/");
    } catch (error) {
      console.error(
        "Error al registrar:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <Header
        num_tel={user?.num_tel}
        token={token}
        user={user}
        tipo_usuario={user?.tipo}
        nombreTerapeuta={user?.nombre}
      />
      <AppointmentContainer>
        <h1>Elección de terapeuta {tipo}</h1>
        <FormGroup>
          <label>Selecciona un Terapeuta:</label>
          <select onChange={(e) => setNumeroTel(e.target.value)}>
            <option value="">--Selecciona--</option>
            {therapists.map((therapist) => (
              <option key={therapist.numero_tel} value={therapist.numero_tel}>
                {therapist.nombre}
              </option>
            ))}
            <option value="NA" key="sin preferencia">
              Sin preferencia
            </option>
          </select>
        </FormGroup>
        <Button onClick={handleSeleccionarTerapeuta}>Confirmar Cita</Button>
      </AppointmentContainer>
    </div>
  );
};

export default SeleccionarTerapeuta;

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

  select,
  input[type="date"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 0;
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
