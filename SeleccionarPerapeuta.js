import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const SeleccionarTerapeuta = () => {
  const [therapists, setTherapists] = useState([]);
  const [numero_tel_terapeuta, setNumeroTel] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const { exp_num } = location.state || {};

  useEffect(() => {
    axios
      .get("http://localhost:3001/expedientes/terapeutas/A")
      .then((response) => setTherapists(response.data))
      .catch((error) => console.error("Error fetching therapists:", error));
  }, []);

  const handleSeleccionarTerapeuta = async (event) => {
    event.preventDefault();
    const URI = "http://localhost:3001/expedientes/cita";

    try {
      const response = await axios.post(URI, {
        exp_num: exp_num,
        numero_tel_terapeuta: numero_tel_terapeuta,
      });

      console.log("Registro exitoso:", response.data);
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
      <Header>
        <LogoContainer>
          <Logo src={"./LogoOficial_HIC_Horizontal.png"} alt="Hospital Logo" />
        </LogoContainer>
        <LogoutButton>Cerrar Sesión</LogoutButton>
      </Header>
      <AppointmentContainer>
        <h1>Elección de terapeuta A</h1>
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin-bottom: 80px;
  background-color: white;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
  margin-right: 10px;
`;

const LogoutButton = styled.button`
  background-color: transparent;
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
