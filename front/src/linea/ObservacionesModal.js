import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Input, Button, message, Spin } from "antd";
import "./ObservacionesModal.css";
import { getObservacionesCita, createObservacionCita } from "../rutasApi.js";

const { TextArea } = Input;

const ObservacionesModal = ({
  visible,
  onClose,
  citaSeleccionada,
  numeroTelTerapeuta,
}) => {
  const [observaciones, setObservaciones] = useState([]);
  const [nuevaObservacion, setNuevaObservacion] = useState("");
  const [cargandoObservaciones, setCargandoObservaciones] = useState(false);
  const [guardandoObservacion, setGuardandoObservacion] = useState(false);

  useEffect(() => {
    if (visible && citaSeleccionada) {
      cargarObservaciones();
    }
  }, [visible, citaSeleccionada]);

  useEffect(() => {
    if (!visible) {
      setObservaciones([]);
      setNuevaObservacion("");
    }
  }, [visible]);

  const cargarObservaciones = async () => {
    setCargandoObservaciones(true);
    try {
      const response = await axios.get(
        getObservacionesCita + citaSeleccionada.cita_id
      );
      setObservaciones(response.data);
    } catch (error) {
      console.error("Error al obtener observaciones:", error);
      message.error("Error al cargar las observaciones");
      setObservaciones([]);
    } finally {
      setCargandoObservaciones(false);
    }
  };

  const guardarObservacion = async () => {
    if (!nuevaObservacion.trim()) {
      message.warning("Por favor ingrese una observación");
      return;
    }

    if (nuevaObservacion.length > 500) {
      message.error("La observación no puede exceder 500 caracteres");
      return;
    }

    setGuardandoObservacion(true);
    try {
      const response = await axios.post(createObservacionCita, {
        cita_id: citaSeleccionada.cita_id,
        observacion: nuevaObservacion.trim(),
        numero_tel_terapeuta: numeroTelTerapeuta,
      });

      message.success("Observación agregada exitosamente");
      setNuevaObservacion("");

      // Agregar la nueva observacion a la lista
      setObservaciones((prev) => [...prev, response.data.observacion]);
    } catch (error) {
      console.error("Error al guardar observación:", error);
      const mensajeError =
        error.response?.data?.message || "Error al guardar la observación";
      message.error(mensajeError);
    } finally {
      setGuardandoObservacion(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClose = () => {
    setNuevaObservacion("");
    onClose();
  };

  return (
    <Modal
      title={`Observaciones - Cita #${citaSeleccionada?.cita_id || ""}`}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={650}
      className="observaciones-modal">
      {cargandoObservaciones ? (
        <div className="observaciones-loading">
          <Spin size="small" />
          <span>Cargando observaciones...</span>
        </div>
      ) : (
        <div>
          {/* Observaciones anteriores */}
          {observaciones.length > 0 ? (
            <div className="observaciones-anteriores">
              <h4>Observaciones anteriores:</h4>
              <div className="observaciones-lista">
                {observaciones.map((obs) => (
                  <div key={obs.id_observacion} className="observacion-item">
                    <p className="observacion-texto">{obs.observacion}</p>
                    <div className="observacion-meta">
                      <strong>Por:</strong> {obs.usuario?.nombre || "Terapeuta"}{" "}
                      - <strong>Fecha:</strong> {formatearFecha(obs.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-observaciones">
              <p>No hay ninguna información</p>
            </div>
          )}

          <div className="nueva-observacion">
            <h4>
              {observaciones.length > 0
                ? "Agregar una nueva observación:"
                : "Agregar observación:"}
            </h4>
            <TextArea
              value={nuevaObservacion}
              onChange={(e) => setNuevaObservacion(e.target.value)}
              placeholder="Escriba su observación aquí..."
              maxLength={500}
              rows={4}
              showCount
              disabled={guardandoObservacion}
            />

            <div className="observaciones-botones">
              <Button onClick={handleClose} disabled={guardandoObservacion}>
                Cancelar
              </Button>
              <Button
                type="primary"
                onClick={guardarObservacion}
                loading={guardandoObservacion}
                disabled={!nuevaObservacion.trim()}>
                {guardandoObservacion ? "Guardando..." : "Guardar Observación"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ObservacionesModal;
