import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Filtrado = ({ pacientes, onFilteredPatients, numero_tel }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [minAge, setMinAge] = useState({ years: "", months: "" });
  const [maxAge, setMaxAge] = useState({ years: "", months: "" });
  const [estadoPacientes, setEstadoPacientes] = useState([]);

  const URI = `http://localhost:3001/expedientes/estadopacientes/${numero_tel}`;

  let filters = [
    "Pendiente de asignar cita",
    "Cita asignada",
    "Tratamiento en proceso",
    "Tratamiento terminado",
    "Tratamiento interrumpido",
    "Diagnóstico pendiente",
  ];

  useEffect(() => {
    const getEstados = async () => {
      try {
        const response = await axios.get(URI);
        if (Array.isArray(response.data)) {
          setEstadoPacientes(response.data);
          console.log("Estado de pacientes:", response.data);
        } else {
          console.error("La respuesta no es un array:", response.data.estados);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getEstados();
  }, [URI]);

  useEffect(() => {
    // Añadir el atributo estatus a cada paciente
    const pacientesConEstatus = pacientes.map((paciente) => {
      const estadoPaciente = estadoPacientes.find(
        (ep) => ep.exp_num === paciente.exp_num
      );
      return {
        ...paciente,
        estatus: estadoPaciente ? estadoPaciente.tratamiento_estado : null,
      };
    });

    setFilteredPatients(pacientesConEstatus);
  }, [estadoPacientes, pacientes]);

  const handleCheckboxChange = (selectedCategory) => {
    if (selectedFilters.includes(selectedCategory)) {
      let filters = selectedFilters.filter((el) => el !== selectedCategory);
      setSelectedFilters(filters);
    } else {
      setSelectedFilters([...selectedFilters, selectedCategory]);
    }
  };

  useEffect(() => {
    filterAndSortPatients();
  }, [
    selectedFilters,
    sortKey,
    nameFilter,
    minAge,
    maxAge,
    pacientes,
    estadoPacientes,
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
        estatus: estadoPaciente ? estadoPaciente.tratamiento_estado : null,
      };
    });

    // Filtrar por estado
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((paciente) => {
        const { estatus } = paciente;
        return selectedFilters.some((filter) => {
          switch (filter) {
            case "Pendiente de asignar cita":
              return estatus === 0;
            case "Cita asignada":
              return estatus === 1;
            case "Tratamiento en proceso":
              return estatus === 1;
            case "Tratamiento terminado":
              return estatus === 2;
            case "Tratamiento interrumpido":
              return estatus === 0;
            case "Diagnóstico pendiente":
              return estatus === 0 || estatus === 1;
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

    // Filtrar por rango de edad
    filtered = filtered.filter((paciente) => {
      const edadEnMeses = calcularEdadEnMeses(paciente.fecha_nacimiento);
      const minEdad =
        (parseInt(minAge.years) || 0) * 12 + (parseInt(minAge.months) || 0);
      const maxEdad =
        (parseInt(maxAge.years) || 999) * 12 + (parseInt(maxAge.months) || 999);
      return edadEnMeses >= minEdad && edadEnMeses <= maxEdad;
    });

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
          <div key={`filters-${idx}`}>
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(category)}
              checked={selectedFilters.includes(category)}
            />
            <label>{category}</label>
          </div>
        ))}
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

const CheckboxGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
  }

  input[type="checkbox"] {
    margin-right: 0.5rem;
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
