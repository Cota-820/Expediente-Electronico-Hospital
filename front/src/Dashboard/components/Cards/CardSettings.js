import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  getUsuario,
  updateUserData,
  updatePassword,
} from "../../../rutasApi.js";

export default function CardSettings() {
  const location = useLocation();
  const fromHeader = location.state?.fromHeader;

  const [userData, setUserData] = useState({
    phone: "",
    email: "",
    fullName: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState({ text: "", type: "" });
  const [passwordMessage, setPasswordMessage] = useState({
    text: "",
    type: "",
  });

  const [user] = useState(
    location.state?.user || JSON.parse(localStorage.getItem("user"))
  );

  const numeroTel = fromHeader ? location.state?.user?.num_tel : user.num_tel;

  console.log("user in card settings", user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(getUsuario(numeroTel));
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const data = await response.json();
        setUserData({
          phone: data.numero_tel,
          fullName: data.nombre,
          email: data.correo,
        });
      } catch (err) {
        setError(err.infoMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [numeroTel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    // Expresión regular básica para validar correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleUpdateInfo = async () => {
    setInfoMessage({ text: "", type: "" });

    // Validar formato de correo antes de enviar
    if (!validateEmail(userData.email)) {
      return setInfoMessage({
        type: "error",
        text: "El correo electrónico no tiene un formato válido.",
      });
    }

    // Validar que el nombre no esté vacío
    if (!userData.fullName.trim()) {
      return setInfoMessage({
        type: "error",
        text: "El nombre no puede irse vacío.",
      });
    }

    try {
      const response = await axios.put(updateUserData(numeroTel), {
        numero_tel: userData.phone,
        nombre: userData.fullName,
        correo: userData.email,
      });
      // Mostrar nuevos datos confirmados por backend (si los devuelve)
      const updatedData = response.data;
      setUserData({
        phone: updatedData.numero_tel,
        fullName: updatedData.nombre,
        email: updatedData.correo,
      });

      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      currentUser.correo = userData.email;
      currentUser.nombre = userData.fullName;
      localStorage.setItem("user", JSON.stringify(currentUser));

      window.dispatchEvent(new Event("storage")); // Forzar evento en la misma pestaña

      setInfoMessage({
        type: "success",
        text: "Información actualizada correctamente.",
      });
    } catch (error) {
      setInfoMessage({
        type: "error",
        text:
          error.response?.data?.infoMessage ||
          "Error al actualizar la información. Por favor intente nuevamente.",
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    setPasswordMessage({ text: "", type: "" });

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return setPasswordMessage({
        type: "error",
        text: "Completa todos los campos.",
      });
    }

    if (!validatePassword(passwords.new)) {
      return setPasswordMessage({
        type: "error",
        text: "La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
      });
    }

    if (passwords.new !== passwords.confirm) {
      return setPasswordMessage({
        type: "error",
        text: "La nueva contraseña y la confirmación no coinciden.",
      });
    }

    try {
      await axios.put(updatePassword(numeroTel), {
        numero_tel: numeroTel,
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });

      setPasswordMessage({
        type: "success",
        text: "Contraseña actualizada correctamente.",
      });

      setPasswords({ current: "", new: "", confirm: "" }); // Limpiar campos
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text:
          error.response?.data?.infoMessage ||
          "Error al cambiar la contraseña. Intenta nuevamente.",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Cargando datos del usuario...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Mi cuenta</h6>
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button">
            Ajustes
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={(e) => e.preventDefault()}>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Información
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Número de teléfono{" "}
                  <span className="text-red-500">** No editable</span>
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 text-gray-500 bg-gray-200 rounded text-sm shadow cursor-not-allowed w-full"
                  value={userData.phone}
                  disabled
                />
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Correo electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow w-full"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Nombre Completo
                </label>
                <input
                  name="fullName"
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow w-full"
                  value={userData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
              type="button"
              onClick={handleUpdateInfo}>
              Actualizar información
            </button>
          </div>

          {infoMessage.text && (
            <div
              style={{
                backgroundColor:
                  infoMessage.type === "success" ? "#c6f6d5" : "#fefcbf",
                color: infoMessage.type === "success" ? "#22543d" : "#975a16",
                borderLeft: `4px solid ${
                  infoMessage.type === "success" ? "#2f855a" : "#b7791f"
                }`,
              }}
              className="mt-4 p-2 rounded font-bold text-lg text-center">
              {infoMessage.text}
            </div>
          )}
        </form>
        <hr className="mt-6 border-b-1 border-blueGray-300" />
        <form onSubmit={(e) => e.preventDefault()}>
          <h6 className="text-blueGray-400 text-sm mt-8 mb-6 font-bold uppercase">
            Cambiar contraseña
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Contraseña actual <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="current"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow w-full"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Nueva contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="new"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow w-full"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Confirmar contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirm"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow w-full"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleChangePassword}
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md">
              Cambiar contraseña
            </button>
          </div>

          {passwordMessage.text && (
            <div
              style={{
                backgroundColor:
                  passwordMessage.type === "success" ? "#c6f6d5" : "#fefcbf",
                color:
                  passwordMessage.type === "success" ? "#22543d" : "#975a16",
                borderLeft: `4px solid ${
                  passwordMessage.type === "success" ? "#2f855a" : "#b7791f"
                }`,
              }}
              className="mt-4 p-2 rounded font-bold text-lg text-center">
              {passwordMessage.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
