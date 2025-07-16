import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { getPacienteEstadosByTerapeuta, updatePacienteEstado, getCitasSinFechaNiHora } from "./rutasApi";

const Filtrado = ({
  pacientes,
  onFilteredPatients,
  num_tel,
  token,
  tipo_usuario,
}) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [expNumFilter, setExpNumFilter] = useState("");
  const [minAge, setMinAge] = useState({ years: "", months: "" });
  const [maxAge, setMaxAge] = useState({ years: "", months: "" });
  const [estadoPacientes, setEstadoPacientes] = useState([]);
  const [pacientesSinCita, setPacientesSinCita] = useState([]); // Pacientes sin cita

  let URI;

  if (tipo_usuario === "R") {
    URI = updatePacienteEstado;
  } else {
    URI = getPacienteEstadosByTerapeuta + num_tel;
  }

  let filters = [
    "Tratamiento en proceso",
    "Tratamiento terminado",
    "Tratamiento interrumpido",
    "Sin cita asignada", // Nuevo filtro
  ];

  // Obtener estados de pacientes
  useEffect(() => {
    const getEstados = async () => {
      try {
        const response = await axios.get(URI);
        if (Array.isArray(response.data)) {
          setEstadoPacientes(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data.estados);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getEstados();
  }, [URI]);

  // Obtener pacientes sin cita (sin fecha ni hora)
  useEffect(() => {
    const fetchPacientesSinCita = async () => {
      try {
        const response = await axios.get(getCitasSinFechaNiHora);
        // Suponiendo que cada cita tiene exp_num
        const expNumsSinCita = response.data.map((cita) => cita.exp_num);
        setPacientesSinCita(expNumsSinCita);
      } catch (error) {
        console.error("Error al obtener citas sin fecha ni hora:", error);
      }
    };

    fetchPacientesSinCita();
  }, []);

  useEffect(() => {
    // Añadir el atributo estatus a cada paciente
    const pacientesConEstatus = estadoPacientes.map((ep) => ({
      nombre: ep.paciente.nombre,
      exp_num: ep.exp_num,
      estatus: ep.estado,
      fecha_nacimiento: ep.paciente.fecha_nacimiento, // asegúrate de que exista
    }));

    setFilteredPatients(pacientesConEstatus);
  }, [estadoPacientes, pacientes]);

  useEffect(() => {
    filterAndSortPatients();
  }, [
    selectedFilters,
    sortKey,
    nameFilter,
    expNumFilter,
    minAge,
    maxAge,
    pacientes,
    estadoPacientes,
    pacientesSinCita,
  ]);

  const filterAndSortPatients = () => {
    let filtered = Array.isArray(pacientes) ? pacientes : [];

    // Añadir el atributo estatus a cada paciente
    filtered = filtered.map((paciente) => {
      const estadoPaciente = estadoPacientes.find(
        (ep) => ep.exp_num === paciente.exp_num
      );
      return {
        ...paciente,
        estatus: estadoPaciente ? estadoPaciente.estado : null,
        fecha_nacimiento: paciente.fecha_nacimiento || (estadoPaciente?.paciente?.fecha_nacimiento ?? null),
      };
    });

    // Filtrar por estado
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((paciente) => {
        const { estatus, exp_num } = paciente;
        return selectedFilters.some((filter) => {
          switch (filter) {
            case "Tratamiento en proceso":
              return estatus === "P";
            case "Tratamiento terminado":
              return estatus === "T";
            case "Tratamiento interrumpido":
              return estatus === "I";
            case "Sin cita asignada":
              return pacientesSinCita.includes(exp_num);
            default:
              return true;
          }
        });
      });
    }

    // Filtrar por nombre
    if (nameFilter) {
      filtered = filtered.filter((paciente) =>
        paciente.nombre.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Filtrar por número de expediente
    if (expNumFilter) {
      filtered = filtered.filter((paciente) =>
        paciente.exp_num?.toString().includes(expNumFilter)
      );
    }

    // Filtrar por rango de edad
    const minTotalMeses =
      (parseInt(minAge.years) || 0) * 12 + (parseInt(minAge.months) || 0);
    const maxTotalMeses =
      (parseInt(maxAge.years) || 0) * 12 + (parseInt(maxAge.months) || 0);

    if (minTotalMeses > 0 || maxTotalMeses > 0) {
      filtered = filtered.filter((paciente) => {
        if (!paciente.fecha_nacimiento) return false;
        const edadMeses = calcularEdadEnMeses(paciente.fecha_nacimiento);
        if (minTotalMeses > 0 && edadMeses < minTotalMeses) return false;
        if (maxTotalMeses > 0 && edadMeses > maxTotalMeses) return false;
        return true;
      });
    }

    // Ordenar los pacientes
    if (sortKey === "nombre") {
      filtered = filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (sortKey === "edad") {
      filtered = filtered.sort(
        (a, b) =>
          calcularEdadEnMeses(a.fecha_nacimiento) -
          calcularEdadEnMeses(b.fecha_nacimiento)
      );
    }
    setFilteredPatients(filtered);
    onFilteredPatients(filtered);
  };

  const calcularEdadEnMeses = (fecha_nacimiento) => {
    if (!fecha_nacimiento) return 0;
    const hoy = new Date();
    const fechaNacimiento = new Date(fecha_nacimiento);
    let años = hoy.getFullYear() - fechaNacimiento.getFullYear();
    let meses = hoy.getMonth() - fechaNacimiento.getMonth();
    if (
      meses < 0 ||
      (meses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      años--;
      meses += 12;
    }
    return años * 12 + meses;
  };

  return (
    <FilterContainer>
      <Title>Filtrar Pacientes</Title>
      <CheckboxGroup>
        <label>Filtrar por estado del paciente:</label>
        {filters.map((category, idx) => (
          <CheckboxRow key={`filters-${idx}`}>
            <input
              type="radio"
              name="estadoPaciente"
              value={category}
              checked={selectedFilters[0] === category}
              onChange={() => setSelectedFilters([category])}
            />
            <label style={{ margin: 0 }}>{category}</label>
          </CheckboxRow>
        ))}
        <CheckboxRow>
          <input
            type="radio"
            name="estadoPaciente"
            value=""
            checked={selectedFilters.length === 0}
            onChange={() => setSelectedFilters([])}
          />
          <label style={{ margin: 0 }}>Todos</label>
        </CheckboxRow>
      </CheckboxGroup>
      <Sort>
        <label>Ordenar por:</label>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="">Ninguno</option>
          <option value="nombre">Nombre</option>
          <option value="edad">Edad</option>
        </select>
      </Sort>

      <Filters>
        <div>
          <label>Filtrar por nombre:</label>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <div>
          <label>Filtrar por número de expediente:</label>
          <input
            type="text"
            value={expNumFilter}
            onChange={(e) => setExpNumFilter(e.target.value)}
            placeholder="Buscar expediente"
          />
        </div>
        <div>
          <label>De edad (mínimo):</label>
          <AgeInputs>
            <input
              placeholder="Años"
              type="number"
              value={minAge.years}
              onChange={(e) => setMinAge({ ...minAge, years: e.target.value })}
            />
            <input
              placeholder="Meses"
              type="number"
              value={minAge.months}
              onChange={(e) => setMinAge({ ...minAge, months: e.target.value })}
            />
          </AgeInputs>
        </div>
        <div>
          <label>Hasta edad (máximo):</label>
          <AgeInputs>
            <input
              placeholder="Años"
              type="number"
              value={maxAge.years}
              onChange={(e) => setMaxAge({ ...maxAge, years: e.target.value })}
            />
            <input
              placeholder="Meses"
              type="number"
              value={maxAge.months}
              onChange={(e) => setMaxAge({ ...maxAge, months: e.target.value })}
            />
          </AgeInputs>
        </div>
      </Filters>
    </FilterContainer>
  );
};

export default Filtrado;

const FilterContainer = styled.div`
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #333;
`;
const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    margin: 0;
    font-weight: normal;
    display: inline;
    line-height: 1.2;
    cursor: pointer;
  }
`;

const CheckboxGroup = styled.div`
  margin-bottom: 1rem;

  > label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
  }

  input[type="checkbox"] {
    margin-right: 0.5rem;
    vertical-align: middle;
  }
`;
const Sort = styled.div`
  margin-bottom: 1rem;

  label {
    font-weight: bold;
    color: #333;
  }

  select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-left: 0.5rem;
  }
`;

const Filters = styled.div`
  margin-bottom: 1rem;

  label {
    font-weight: bold;
    color: #333;
  }

  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 0.5rem;
  }
`;

const AgeInputs = styled.div`
  display: flex;
  gap: 0.5rem;

  input {
    width: 50%;
  }
`;