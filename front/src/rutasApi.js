const host = "http://localhost:3001/";

//TEST
const QCHAT_test =
  "https://docs.google.com/forms/d/e/1FAIpQLSd9SgHqVPBoTbqz5ZQ6f9UDdIAJhSfoshkgFdRUjsYv0lYsnA/viewform";
const SCQ_test =
  "https://docs.google.com/forms/d/e/1FAIpQLSfvTRcdS-ncsvY2zIhvE3x0qmlhqBQ3BeoBHoPiaWg-qHgsAw/viewform";

//Rutas citas
const citas = host + "citas/";
const createPrimeraCita = citas + "primera-cita";
const getEtapaCita = citas + "etapa/";
const getCheckCitaPrevia = citas + "check-cita-previa/";

//Rutas Observaciones
const observaciones = host + "observaciones/";

const getObservacionesCita = observaciones + "cita/";
const createObservacionCita = observaciones + "cita";

//Rutas PacienteEstado
const pacienteEstado = host + "estado/";

const createPacienteEstado = pacienteEstado;
const updatePacienteEstado = pacienteEstado;
const deletePacienteEstado = pacienteEstado;
const getPacienteEstadosByTerapeuta = pacienteEstado + "terapeuta/";
const getAllPacienteEstados = pacienteEstado;
const getPacienteEstadoByExpNum = (exp_num) => `${pacienteEstado}${exp_num}`;

//Rutas Expedientes -- Vista previa
const expedientes = host + "expedientes/";
// Rutas Expedientes
const createExpediente = expedientes;
const updateExpediente = expedientes;
const getExpediente = expedientes;
const getTerapeutaWithPatients = expedientes + "vistaprevia/";
const getTerapeutasDePaciente = (exp_num) =>
  `${expedientes}terapeutas-paciente/${exp_num}`;

//Rutas Expedientes -- Horario
const getCitasTerapeutaDia = expedientes + "horario/";
const getCitasTerapeutaDiaByDia = expedientes + "horario/";
const getCitasTerapeutaSemana = expedientes + "horario/semana/";

//Rutas Expedientes -- Citas
const getCitasSinFechaNiHora = expedientes + "citas/sinfecha/sinhora";
const getCitasByPaciente = expedientes + "citas/paciente/";
const getCitas = expedientes + "todas/las/citas";

// Rutas expedientes/usuarios
const usuarios = host + "expedientes/usuarios";
// Settings Card
const getUsuario = (numeroTel) => `${usuarios}/${numeroTel}`;
const updateUserData = (numeroTel) => `${usuarios}/${numeroTel}`;
const updatePassword = (numeroTel) => `${usuarios}/changepassword/${numeroTel}`;
// Card Table
const updateUserPhone = (numeroTel) => `${usuarios}/updatephone/${numeroTel}`;
const deleteUsuario = (numeroTel) => `${usuarios}/${numeroTel}`;
// Header stats
const getAllUsuarios = usuarios + "/all";
const getPacientes = usuarios + "/pacientes";
// AltaUsuarios
const createUsuario = usuarios + "/new";
//Tipo
const getUsuariosByTipo = usuarios + "/" + "tipo/";
// Ruta Expediente PacienteTerapeuta
const createPacientesTerapeutas = expedientes + "pacientesterapeutas";

export {
  QCHAT_test,
  SCQ_test,
  citas,
  createPrimeraCita,
  getEtapaCita,
  getCheckCitaPrevia,
  getObservacionesCita,
  createObservacionCita,
  createPacienteEstado,
  updatePacienteEstado,
  deletePacienteEstado,
  getPacienteEstadosByTerapeuta,
  getAllPacienteEstados,
  getTerapeutaWithPatients,
  getCitasTerapeutaDia,
  getCitasTerapeutaDiaByDia,
  getCitasTerapeutaSemana,
  getCitasByPaciente,
  getCitasSinFechaNiHora,
  getUsuario,
  updateUserData,
  updatePassword,
  updateUserPhone,
  deleteUsuario,
  getAllUsuarios,
  getPacientes,
  createUsuario,
  getUsuariosByTipo,
  createPacientesTerapeutas,
  createExpediente,
  getExpediente,
  updateExpediente,
  getPacienteEstadoByExpNum,
  getCitas,
  getTerapeutasDePaciente,
};
