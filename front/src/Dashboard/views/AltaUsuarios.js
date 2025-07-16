import axios from "axios";
import React, { useState } from "react";

import { createUsuario } from "../../rutasApi.js";
const NewUser = () => {
  const [lada, setLada] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [userTypes, setUserTypes] = useState({
    A: false,
    B: false,
    C: false,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setMessage({ text: "", type: "" });
    if (newRole !== "T") {
      setUserTypes({ A: false, B: false, C: false });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUserTypes((prev) => ({ ...prev, [name]: checked }));
    setMessage({ text: "", type: "" });
  };

  const validateForm = () => {
    if (!phone.match(/^\d{10}$/)) {
      setMessage({
        text: "Número de teléfono inválido. Debe tener 10 dígitos.",
        type: "error",
      });
      return false;
    }
    if (!role) {
      setMessage({
        text: "Por favor seleccione un rol para el usuario.",
        type: "error",
      });
      return false;
    }
    if (role === "T") {
      const hasSpecialty = Object.values(userTypes).some((v) => v);
      if (!hasSpecialty) {
        setMessage({
          text: "Los terapeutas deben tener al menos una especialidad seleccionada.",
          type: "error",
        });
        return false;
      }
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    let typeUser = role;
    if (role === "T") {
      typeUser = Object.entries(userTypes)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .sort()
        .join("");
    }

    const num_tel = (lada + phone).toString().trim();

    try {
      await axios.post(createUsuario, {
        numero_tel: num_tel,
        tipo_usuario: typeUser,
      });
      setMessage({
        type: "success",
        text: "Usuario registrado correctamente.",
      });
      setPhone("");
      setRole("");
      setUserTypes({ A: false, B: false, C: false });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Error al registrar el usuario. Por favor intente nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log("Mensaje:", message);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Nuevo Usuario</h6>
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
            disabled>
            Alta
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleRegister}>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Información del Usuario
          </h6>

          <div className="flex flex-wrap">
            <div className="w-full lg:w-3/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Lada <span className="text-red-500">*</span>
                </label>
                <select
                  className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  value={lada}
                  onChange={(e) => setLada(e.target.value)}
                  required>
                  <option value="">Selecciona una lada</option>
                  <option value="52">+52</option>
                  <option value="1">+1</option>
                  {/* Más opciones */}
                </select>
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Número telefónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  placeholder="Número telefónico"
                  maxLength={10}
                />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  value={role}
                  onChange={handleRoleChange}
                  required>
                  <option value="">Selecciona un rol</option>
                  <option value="ADM">Administrador</option>
                  <option value="R">Recepcionista</option>
                  <option value="T">Terapeuta</option>
                </select>
              </div>
            </div>

            {role === "T" && (
              <div className="w-full px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Especialidades <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    {Object.entries(userTypes).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center space-x-2 gap-5">
                        <input
                          type="checkbox"
                          name={key}
                          checked={value}
                          onChange={handleCheckboxChange}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-blueGray-600 text-sm">
                          Terapeuta Tipo {key}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "Registrar Usuario"}
            </button>
          </div>
          {message.text && (
            <div
              style={{
                backgroundColor:
                  message.type === "success" ? "#c6f6d5" : "#fefcbf",
                color: message.type === "success" ? "#22543d" : "#975a16",
                borderLeft: `4px solid ${
                  message.type === "success" ? "#2f855a" : "#b7791f"
                }`,
              }}
              className="mt-4 p-2 rounded font-bold text-lg text-center">
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewUser;
