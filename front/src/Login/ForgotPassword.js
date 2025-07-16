// components/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { end } from "@popperjs/core";

const BASE_URL = "http://localhost:3001/expedientes";

const ENDPOINTS = {
  forgotPassword: `${BASE_URL}/usuarios/forgotpass`,
  verifyCode: `${BASE_URL}/usuarios/verifycode`,
  resetPassword: `${BASE_URL}/usuarios/resetpass`,
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: Ingresar email, 2: Ingresar código, 3: Nueva contraseña
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(ENDPOINTS.forgotPassword, { email });

      if (response.data.success) {
        setSuccess("Código de verificación enviado a tu correo");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Verificando código:", code);
      console.log("Email:", email);
      const response = await axios.post(ENDPOINTS.verifyCode, { email, code });

      if (response.data.success) {
        setSuccess("Código verificado correctamente");
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Código inválido");
    } finally {
      setLoading(false);
    }
  };

  function isStrongPassword(password) {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) && // al menos una mayúscula
      /[a-z]/.test(password) && // al menos una minúscula
      /[0-9]/.test(password) && // al menos un número
      /[!@#$%^&*(),.?":{}|<>]/.test(password) // al menos un carácter especial
    );
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(ENDPOINTS.resetPassword, {
        email,
        code,
        newPassword,
      });

      if (response.data.success) {
        setSuccess("Contraseña actualizada correctamente");
        setTimeout(() => navigate("/login-sign-in-up"), 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al actualizar la contraseña"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        backgroundColor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
      <Typography variant="h5" gutterBottom>
        Recuperar Contraseña
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {step === 1 && (
        <form onSubmit={handleSendCode}>
          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}>
            {loading ? "Enviando..." : "Enviar Código"}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode}>
          <TextField
            fullWidth
            label="Código de verificación"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}>
            {loading ? "Verificando..." : "Verificar Código"}
          </Button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirmar Contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}>
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </Button>
        </form>
      )}
    </Box>
  );
};

export default ForgotPassword;
