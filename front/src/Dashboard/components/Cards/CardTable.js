import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { updateUserPhone, deleteUsuario } from "../../../rutasApi";

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1300,
};

const modalContentStyle = {
  backgroundColor: "background.paper",
  boxShadow: 24,
  padding: "2rem",
  borderRadius: "8px",
  width: "100%",
  maxWidth: "450px",
  maxHeight: "90vh",
  overflowY: "auto",
  margin: "1rem",
  border: "none",
};

export default function CardTable({
  color,
  users,
  onUserUpdate,
  onUserDelete,
}) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editedNumber, setEditedNumber] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [numberError, setNumberError] = useState("");

  const validateNumber = (number) => {
    if (!number) {
      return "El número no puede estar vacío";
    }
    if (!/^\d+$/.test(number)) {
      return "Solo se permiten números";
    }
    if (number.length < 10) {
      return "El número debe tener al menos 10 dígitos";
    }
    return "";
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setEditedNumber(value);
    setNumberError(validateNumber(value));
  };

  const getUserType = (tipo) => {
    switch (tipo) {
      case "ADM":
        return "Administrador";
      case "R":
        return "Recepcionista";
      case "A":
        return "Terapeuta Tipo A";
      case "B":
        return "Terapeuta Tipo B";
      case "C":
        return "Terapeuta Tipo C";
      case "AB":
        return "Terapeuta Tipo AB";
      case "AC":
        return "Terapeuta Tipo AC";
      case "BC":
        return "Terapeuta Tipo BC";
      case "ABC":
        return "Terapeuta Tipo ABC";
      default:
        return "No Aplica";
    }
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setEditedNumber(user.number);
    setNumberError("");
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentUser(null);
    setEditedNumber("");
    setNumberError("");
  };

  const handleOpenDeleteModal = (user) => {
    setCurrentUser(user);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentUser(null);
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleUpdateNumber = async () => {
    const error = validateNumber(editedNumber);
    if (error) {
      setNumberError(error);
      return;
    }

    if (!currentUser || !editedNumber) return;

    setIsUpdating(true);
    try {
      const response = await axios.put(updateUserPhone(currentUser.number), {
        numero_actual: currentUser.number,
        nuevo_numero: editedNumber,
      });

      setAlert({
        open: true,
        message: "Número actualizado correctamente",
        severity: "success",
      });

      onUserUpdate(currentUser.id, { ...currentUser, number: editedNumber });
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating user number:", error);

      let errorMessage = "Error al actualizar el número";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Datos inválidos";
        } else if (error.response.status === 404) {
          errorMessage = "Usuario no encontrado";
        } else if (error.response.status === 409) {
          errorMessage = "El nuevo número ya está en uso";
        }
      }

      setAlert({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;

    console.log("Eliminando usuario:", currentUser.number);

    setIsDeleting(true);
    try {
      await axios.delete(deleteUsuario(currentUser.number));

      setAlert({
        open: true,
        message: "Usuario eliminado correctamente",
        severity: "success",
      });
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting user:", error);
      setAlert({
        open: true,
        message:
          error.response?.data?.message || "Error al eliminar el usuario F",
        severity: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }>
                Números autorizados
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }>
                  Nombre
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }>
                  Número
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }>
                  Tipo de usuario
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                    <span
                      className={
                        "ml-3 font-bold " +
                        (color === "light" ? "text-blueGray-600" : "text-white")
                      }>
                      {user.name}
                    </span>
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {user.number}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <i
                      style={{
                        color:
                          user.type === "ADM"
                            ? "rgb(226,35,26)"
                            : user.type === "R"
                            ? "rgb(255,209,0)"
                            : "rgb(55,93,157)",
                      }}
                      className="fas fa-circle mr-2"></i>
                    {getUserType(user.type)}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      style={{
                        borderColor: "#3b82f6",
                        color: "#3b82f6",
                        marginRight: "8px",
                      }}
                      sx={{
                        "&:hover": {
                          borderColor: "#1d4ed8",
                          backgroundColor: "#dbeafe",
                          color: "#1d4ed8",
                        },
                      }}
                      onClick={() => handleOpenEditModal(user)}>
                      Actualizar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      style={{
                        borderColor: "#ef4444",
                        color: "#ef4444",
                      }}
                      sx={{
                        "&:hover": {
                          borderColor: "#b91c1c",
                          backgroundColor: "#fee2e2",
                          color: "#b91c1c",
                        },
                      }}
                      onClick={() => handleOpenDeleteModal(user)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para editar número */}
      <Modal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-number-modal"
        aria-describedby="modal-to-edit-user-number"
        sx={modalStyle}>
        <Box sx={modalContentStyle}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3 }}>
            Editar número de {currentUser?.name}
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Número de teléfono"
            value={editedNumber}
            onChange={handleNumberChange}
            error={!!numberError}
            helperText={numberError}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 15,
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}>
            <Button
              onClick={handleCloseEditModal}
              variant="outlined"
              sx={{
                px: 3,
                py: 1,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "bold",
              }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateNumber}
              disabled={isUpdating || !!numberError}
              sx={{
                px: 3,
                py: 1,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: "#3b82f6",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
                "&:disabled": {
                  backgroundColor: "#e5e7eb",
                  color: "#9ca3af",
                },
              }}>
              {isUpdating ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal para confirmar eliminación - Estilo mejorado */}
      <Modal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-user-modal"
        aria-describedby="modal-to-confirm-user-deletion"
        sx={modalStyle}>
        <Box sx={modalContentStyle}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold" }}>
            Confirmar eliminación
          </Typography>
          <Typography sx={{ mt: 2, mb: 1 }}>
            ¿Estás seguro que deseas eliminar a {currentUser?.name}?
          </Typography>
          <Typography sx={{ mb: 3, color: "error.main", fontSize: "0.875rem" }}>
            Esta acción es permanente. Las citas sin atender deberán ser
            reagendadas.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}>
            <Button
              onClick={handleCloseDeleteModal}
              variant="outlined"
              sx={{
                px: 3,
                py: 1,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "bold",
              }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteUser}
              disabled={isDeleting}
              sx={{
                px: 3,
                py: 1,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "bold",
                "&:disabled": {
                  backgroundColor: "#e5e7eb",
                  color: "#9ca3af",
                },
              }}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar para mostrar alertas */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{
            width: "100%",
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
  users: [],
  onUserUpdate: () => {},
  onUserDelete: () => {},
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
  onUserUpdate: PropTypes.func,
  onUserDelete: PropTypes.func,
};
