import React, { useState, useEffect } from "react";
import logo from "../public/LogoOficial_HIC_horizontal.png";
import "./loginview.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Link } from "react-router-dom";
import { message } from "antd";

const API_BASE = "http://localhost:3001/expedientes";

const ENDPOINTS = {
  login: `${API_BASE}/usuarios/login`,
  registerValid: (num_tel) => `${API_BASE}/usuarios/registervalid/${num_tel}`,
  completeRegistration: `${API_BASE}/usuarios/completeregistration`,
};

const LoginView = ({ onLogin, showForgotPassword = true }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm, setLoginForm] = useState({
    num_tel: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    num_tel: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });

  const [errors, setErrors] = useState({});
  const [phoneValid, setPhoneValid] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (registerForm.num_tel.length >= 10) {
      verifyPhoneNumber();
    } else {
      setPhoneValid(null);
    }
  }, [registerForm.num_tel]);

  const verifyPhoneNumber = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        ENDPOINTS.registerValid(registerForm.num_tel)
      );

      if (response.data) {
        setPhoneValid(true);
        setErrors((prev) => ({ ...prev, num_tel: null }));
      } else {
        setPhoneValid(false);
        setErrors((prev) => ({
          ...prev,
          num_tel: "Número no válido para registro",
        }));
      }
    } catch (error) {
      setPhoneValid(false);

      if (error.response?.status === 404) {
        setErrors((prev) => ({
          ...prev,
          num_tel: "Número no encontrado o no válido para registro",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          num_tel:
            error.response?.data?.message || "Error al verificar el número",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Validación en tiempo real de la contraseña
  useEffect(() => {
    if (registerForm.password) {
      const newStrength = {
        length: registerForm.password.length >= 8,
        upperCase: /[A-Z]/.test(registerForm.password),
        lowerCase: /[a-z]/.test(registerForm.password),
        number: /\d/.test(registerForm.password),
        specialChar: /[^\w\s]/.test(registerForm.password),
      };
      setPasswordStrength(newStrength);
    } else {
      setPasswordStrength({
        length: false,
        upperCase: false,
        lowerCase: false,
        number: false,
        specialChar: false,
      });
    }
  }, [registerForm.password]);

  // Función de validación mejorada
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^\w\s]/.test(password);

    return (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!phoneValid) {
      newErrors.num_tel = "Verifique su número de teléfono primero";
    }
    if (!registerForm.name.trim()) {
      newErrors.name = "Nombre es requerido";
    }
    if (!registerForm.email.trim()) {
      newErrors.email = "Email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      newErrors.email = "Email no válido";
    }

    // Validación detallada de contraseña
    if (!registerForm.password) {
      newErrors.password = "Contraseña es requerida";
    } else {
      const passwordValid = validatePassword(registerForm.password);
      if (!passwordValid) {
        newErrors.password = "La contraseña no cumple todos los requisitos";
      }
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const num_tel = registerForm.num_tel.toString().trim();

    try {
      setLoading(true);
      const response = await axios.post(ENDPOINTS.completeRegistration, {
        numero_tel: num_tel,
        nombre: registerForm.name,
        correo: registerForm.email,
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
      });
      if (response.data.success) {
        message.success("Registro exitoso. Por favor, inicia sesión.");
        setActiveTab("login");
        setRegisterForm({
          name: "",
          num_tel: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Error al completar registro",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginForm.num_tel || !loginForm.password) {
      setErrors({
        login: "Por favor, ingrese su número de teléfono y contraseña",
      });
      return;
    }

    try {
      setLoading(true);
      const num_tel = loginForm.num_tel.toString().trim();
      const response = await axios.post(ENDPOINTS.login, {
        numero_tel: num_tel,
        password: loginForm.password,
      });

      if (response.data.success) {
        message.success("Inicio de sesión exitoso");

        onLogin && onLogin(response.data.user);

        // Guardar el token en localStorage o sessionStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            // num_tel, id, nombre, tipo
            num_tel: num_tel,
            id: response.data.user.id,
            nombre: response.data.user.nombre,
            tipo: response.data.user.tipo,
          })
        );
        console.log("Usuario:", response.data.user);

        console.log("Token guardado:", response.data.token);

        // Redirección según tipo de usuario
        if (response.data.user.tipo === "ADM") {
          navigate("/admin", {
            state: {
              num_tel: response.data.num_tel,
              token: response.data.token,
              user: response.data.user,
              tipo_usuario: response.data.user.tipo_usuario,
            },
          });
        } else {
          navigate("/");
        }
      } else {
        setErrors({ login: "Credenciales incorrectas" });
      }
    } catch (error) {
      setErrors({
        login: error.response?.data?.message || "Error al iniciar sesión",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setErrors({});
  };

  const handleInputChange = (e, formType) => {
    const { name, value, type, checked } = e.target;

    if (formType === "login") {
      setLoginForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setRegisterForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  return (
    <div className="loginview-auth-container">
      <div className="loginview-header-container">
        <div className="loginview-logo-container">
          <img
            src={logo}
            alt="Logo Oficial HIC"
            className="loginview-hospital-logo"
          />
        </div>
      </div>
      <div className="loginview-tabs">
        <button
          className={`loginview-tab ${
            activeTab === "login" ? "loginview-active" : ""
          }`}
          onClick={() => handleTabChange("login")}>
          Iniciar sesión
        </button>
        <button
          className={`loginview-tab ${
            activeTab === "register" ? "loginview-active" : ""
          }`}
          onClick={() => handleTabChange("register")}>
          Registrarse
        </button>
      </div>

      <div className="loginview-tab-content">
        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="loginview-auth-form">
            {errors.login && (
              <div className="loginview-error-message">{errors.login}</div>
            )}
            <div className="loginview-form-group">
              <label htmlFor="login-num_tel">Número de teléfono</label>
              <input
                id="login-num_tel"
                type="number"
                name="num_tel"
                value={loginForm.num_tel}
                onChange={(e) => handleInputChange(e, "login")}
                required
              />
            </div>

            <div className="loginview-form-group">
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={loginForm.password}
                onChange={(e) => handleInputChange(e, "login")}
                required
              />
            </div>

            {/*<div className="loginview-form-options">
              {showForgotPassword && (
                <a href="#!" className="loginview-forgot-password">
                  ¿Olvidaste tu contraseña?
                </a>
              )}
            </div>*/}

            <div className="loginview-form-options">
              {showForgotPassword && (
                <Link
                  to="/forgot-password"
                  className="loginview-forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              )}
            </div>

            <button type="submit" className="loginview-submit-btn">
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            <p className="loginview-switch-form">
              ¿Primera vez aquí?{" "}
              <button type="button" onClick={() => handleTabChange("register")}>
                Registrar cuenta
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="loginview-auth-form">
            {errors.submit && (
              <div className="loginview-error-message">{errors.submit}</div>
            )}
            <div className="loginview-form-group">
              <label htmlFor="register-name">Nombre</label>
              <input
                id="register-name"
                type="text"
                name="name"
                value={registerForm.name}
                onChange={(e) => handleInputChange(e, "register")}
                required
                className={errors.name ? "loginview-input-error" : ""}
              />
              {errors.name && (
                <span className="loginview-error-message">{errors.name}</span>
              )}
            </div>

            <div className="loginview-form-group">
              <label htmlFor="register-num_tel">Número de teléfono</label>
              <input
                id="register-num_tel"
                type="number"
                name="num_tel"
                value={registerForm.num_tel}
                onChange={(e) => handleInputChange(e, "register")}
                required
                className={errors.num_tel ? "loginview-input-error" : ""}
              />
              {loading && registerForm.num_tel.length === 10 && (
                <span className="loginview-loading">Verificando...</span>
              )}
              {phoneValid === true && (
                <span className="loginview-success">✓ Número válido</span>
              )}
              {errors.num_tel && (
                <span className="loginview-error-message">
                  {errors.num_tel}
                </span>
              )}
            </div>

            <div className="loginview-form-group">
              <label htmlFor="register-email">Correo electrónico</label>
              <input
                id="register-email"
                type="email"
                name="email"
                value={registerForm.email}
                onChange={(e) => handleInputChange(e, "register")}
                required
                className={errors.email ? "loginview-input-error" : ""}
              />
              {errors.email && (
                <span className="loginview-error-message">{errors.email}</span>
              )}
            </div>

            <div className="loginview-form-group">
              <label htmlFor="register-password">Contraseña</label>
              <input
                id="register-password"
                type="password"
                name="password"
                value={registerForm.password}
                onChange={(e) => handleInputChange(e, "register")}
                required
                className={errors.password ? "loginview-input-error" : ""}
              />

              {registerForm.password && (
                <div className="loginview-password-feedback">
                  <p>La contraseña debe contener:</p>
                  <ul>
                    <li
                      className={passwordStrength.length ? "valid" : "invalid"}>
                      Mínimo 8 caracteres
                    </li>
                    <li
                      className={
                        passwordStrength.upperCase ? "valid" : "invalid"
                      }>
                      Al menos una mayúscula (A-Z)
                    </li>
                    <li
                      className={
                        passwordStrength.lowerCase ? "valid" : "invalid"
                      }>
                      Al menos una minúscula (a-z)
                    </li>
                    <li
                      className={passwordStrength.number ? "valid" : "invalid"}>
                      Al menos un número (0-9)
                    </li>
                    <li
                      className={
                        passwordStrength.specialChar ? "valid" : "invalid"
                      }>
                      Al menos un carácter especial (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}

              {errors.password && (
                <span className="loginview-error-message">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="loginview-form-group">
              <label htmlFor="register-confirmPassword">
                Confirmar Contraseña
              </label>
              <input
                id="register-confirmPassword"
                type="password"
                name="confirmPassword"
                value={registerForm.confirmPassword}
                onChange={(e) => handleInputChange(e, "register")}
                required
                className={
                  errors.confirmPassword ? "loginview-input-error" : ""
                }
              />
              {errors.confirmPassword && (
                <span className="loginview-error-message">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button type="submit" className="loginview-submit-btn">
              {loading ? "Registrando..." : "Registrarse"}
            </button>

            <p className="loginview-switch-form">
              ¿Ya tienes una cuenta?{" "}
              <button type="button" onClick={() => handleTabChange("login")}>
                Iniciar sesión
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginView;
