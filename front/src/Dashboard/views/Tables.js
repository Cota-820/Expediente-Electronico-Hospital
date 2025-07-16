import React, { useEffect, useState } from "react";
import axios from "axios";

import CardTable from "../components/Cards/CardTable.js";

import { getAllUsuarios } from "../../rutasApi.js";
export default function Tables() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(getAllUsuarios);
        // La respuesta tiene la forma { count, usuarios: [...] }
        setUsuarios(response.data.usuarios || []);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable
            users={usuarios.map((u) => ({
              name: u.nombre || "Pendiente terminar registro",
              number: u.numero_tel,
              type: u.tipo_usuario,
              raw: u,
            }))}
          />
        </div>
      </div>
    </>
  );
}
