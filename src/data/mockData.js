// src/data/mockData.js

// 1. USUARIOS INICIALES (Para el Login y la nueva pantalla de Usuarios)
export const initialUsers = [
  {
    id: 1,
    nombre: "Recepción Local",
    email: "admin@escaperoom.com",
    password: "admin",
    rol: "RECEPCIONISTA"
  },
  {
    id: 2,
    nombre: "Analista Técnico",
    email: "analista@escaperoom.com",
    password: "admin",
    rol: "ANALISTA"
  }
];

// 2. LISTADO DE SALAS (Para los selectores de los formularios de agregar/editar)
export const escapeRooms = [
  "Misterio del Faraón",
  "Laboratorio del Dr. Chaos",
  "La Mansión Embrujada",
  "Atraco al Banco Central"
];

// 3. RESERVAS INICIALES (Extraídas textualmente de tus capturas del PDF)
export const initialReservations = [
  {
    id: "REV-001",
    cliente: "María González",
    sala: "Misterio del Faraón",
    fecha: "2026-05-10",
    hora: "14:00",
    personas: 4,
    estado: "Confirmada", // Confirmada, Completada, Cancelada
    pago: "Pagado",
    canal: "Web"          // Únicamente Web o WhatsApp
  },
  {
    id: "REV-002",
    cliente: "Gonzalo Pérez",
    sala: "Misterio del Faraón",
    fecha: "2026-05-10",
    hora: "16:30",
    personas: 6,
    estado: "Confirmada",
    pago: "Pagado",
    canal: "WhatsApp"
  },
  {
    id: "REV-003",
    cliente: "Mariana Rodríguez",
    sala: "Laboratorio Zombie",
    fecha: "2026-05-10",
    hora: "19:00",
    personas: 3,
    estado: "Cancelada",
    pago: "No Pagado",
    canal: "Web"
  },
  {
    id: "REV-004",
    cliente: "Juan Gómez",
    sala: "Laboratorio Zombie",
    fecha: "2026-06-10",
    hora: "21:30",
    personas: 5,
    estado: "Confirmada",
    pago: "No Pagado", // Entra como pendiente/por cobrar
    canal: "WhatsApp"
  },
  {
    id: "REV-005",
    cliente: "Lucas Gentile",
    sala: "Misterio del Faraón",
    fecha: "2026-05-15", // Fecha posterior (no cuenta en la jornada auditada)
    hora: "18:00",
    personas: 2,
    estado: "Confirmada",
    pago: "Pagado",
    canal: "Web"
  },
  // --- SÁBADO 20 DE JUNIO (Simultaneidad total a las 16:00 y 19:00) ---
  {
    id: "REV-101",
    cliente: "Andrés Mendoza",
    sala: "Laboratorio del Dr. Chaos",
    fecha: "2026-06-20",
    hora: "16:00",
    personas: 4,
    estado: "Completada",
    pago: "Pagado",
    canal: "Web"
  },
  {
    id: "REV-102",
    cliente: "Mariana Torres",
    sala: "La Mansión Embrujada",
    fecha: "2026-06-20",
    hora: "16:00", // Al mismo tiempo que Andrés
    personas: 6,
    estado: "Confirmada",
    pago: "Pagado",
    canal: "WhatsApp"
  },
  {
    id: "REV-103",
    cliente: "Carlos Giménez",
    sala: "Misterio del Faraón",
    fecha: "2026-06-20",
    hora: "19:00",
    personas: 3,
    estado: "Confirmada",
    pago: "Pagado",
    canal: "Web"
  },
  {
    id: "REV-104",
    cliente: "Gaston Peralta",
    sala: "Atraco al Banco Central",
    fecha: "2026-06-20",
    hora: "19:00", // Al mismo tiempo que Carlos
    personas: 5,
    estado: "Confirmada",
    pago: "No Pagado",
    canal: "WhatsApp"
  },

// --- PASADO: SÁBADO 6 DE JUNIO (Acá sí es lógico que estén Completadas) ---
  {
    id: "REV-098",
    cliente: "Mariano Liniers",
    sala: "Atraco al Banco Central",
    fecha: "2026-06-06",
    hora: "16:00",
    personas: 5,
    estado: "Completada", // Correcto: Ya pasó
    pago: "Pagado",
    canal: "Web"
  },
  {
    id: "REV-099",
    cliente: "Florencia Varela",
    sala: "La Mansión Embrujada",
    fecha: "2026-06-06",
    hora: "18:00",
    personas: 4,
    estado: "Completada", // Correcto: Ya pasó
    pago: "Pagado",
    canal: "WhatsApp"
  },

  // --- FUTURO: SÁBADO 20 DE JUNIO (Turnos en paralelo a las 16:00 y 19:00) ---
  {
    id: "REV-101",
    cliente: "Andrés Mendoza",
    sala: "Laboratorio del Dr. Chaos",
    fecha: "2026-06-20",
    hora: "16:00",
    personas: 4,
    estado: "Confirmada", // CORREGIDO: Es futuro, está agendada
    pago: "Pagado",
    canal: "Web"
  },
  {
    id: "REV-102",
    cliente: "Mariana Torres",
    sala: "La Mansión Embrujada",
    fecha: "2026-06-20",
    hora: "16:00", 
    personas: 6,
    estado: "Confirmada", // CORREGIDO: Es futuro
    pago: "Pagado",
    canal: "WhatsApp"
  },
  {
    id: "REV-103",
    cliente: "Carlos Giménez",
    sala: "Misterio del Faraón",
    fecha: "2026-06-20",
    hora: "19:00",
    personas: 3,
    estado: "Confirmada",
    pago: "Pagado",
    canal: "Web"
  },
  {
    id: "REV-104",
    cliente: "Gaston Peralta",
    sala: "Atraco al Banco Central",
    fecha: "2026-06-20",
    hora: "19:00", 
    personas: 5,
    estado: "Confirmada",
    pago: "No Pagado",
    canal: "WhatsApp"
  },

  // --- FUTURO: DOMINGO 21 DE JUNIO ---
  {
    id: "REV-105",
    cliente: "Gonzalo Dalto",
    sala: "Misterio del Faraón",
    fecha: "2026-06-21",
    hora: "18:00",
    personas: 2,
    estado: "Confirmada",
    pago: "No Pagado",
    canal: "Web"
  },

  // --- FUTURO: LUNES 22 DE JUNIO ---
  {
    id: "REV-106",
    cliente: "Estefanía Paz",
    sala: "Atraco al Banco Central",
    fecha: "2026-06-22",
    hora: "15:00",
    personas: 4,
    estado: "Cancelada", // Lógico: El cliente ya avisó que no viene
    pago: "No Pagado",
    canal: "WhatsApp"
  },
  {
    id: "REV-107",
    cliente: "Rodrigo Palacios",
    sala: "Frankenstein",
    fecha: "2026-06-22",
    hora: "20:00",
    personas: 5,
    estado: "Confirmada",
    pago: "Pagado",
    canal: "Web"
  },

  // --- FUTURO: MARTES 23 DE JUNIO ---
  {
    id: "REV-108",
    cliente: "Clara Benítez",
    sala: "La Mansión Embrujada",
    fecha: "2026-06-23",
    hora: "17:00",
    personas: 4,
    estado: "Confirmada", // CORREGIDO: Es futuro
    pago: "Pagado",
    canal: "Web"
  },

  // --- FUTURO: JUEVES 25 DE JUNIO ---
  {
    id: "REV-109",
    cliente: "Julieta Rossi",
    sala: "Misterio del Faraón",
    fecha: "2026-06-25",
    hora: "14:00",
    personas: 3,
    estado: "Cancelada",
    pago: "No Pagado",
    canal: "Web"
  },

  // --- FUTURO: VIERNES 26 DE JUNIO (Simultaneidad a las 20:00) ---
  {
    id: "REV-110",
    cliente: "Milagros Sosa",
    sala: "Frankenstein",
    fecha: "2026-06-26",
    hora: "15:00",
    personas: 4,
    estado: "Confirmada",
    pago: "Pagado",
    canal: "Web"
  },
  {
    id: "REV-111",
    cliente: "Bruno Díaz",
    sala: "La Mansión Embrujada",
    fecha: "2026-06-26",
    hora: "20:00",
    personas: 6,
    estado: "Confirmada", // CORREGIDO: Es futuro
    pago: "Pagado",
    canal: "Web"
  },
  {
    id: "REV-112",
    cliente: "Sofía Herrera",
    sala: "Laboratorio del Dr. Chaos",
    fecha: "2026-06-26",
    hora: "20:00", 
    personas: 4,
    estado: "Confirmada",
    pago: "No Pagado",
    canal: "WhatsApp"
  },

  // --- FUTURO: SÁBADO 27 DE JUNIO ---
  {
    id: "REV-113",
    cliente: "Lucas Gentile",
    sala: "Misterio del Faraón",
    fecha: "2026-06-27",
    hora: "17:00",
    personas: 2,
    estado: "Confirmada",
    pago: "Pagado",
    canal: "Web"
  },
  {
    id: "REV-114",
    cliente: "Daniela Medina",
    sala: "Atraco al Banco Central",
    fecha: "2026-06-27",
    hora: "17:00", 
    personas: 5,
    estado: "Confirmada",
    pago: "Pagado",
    canal: "WhatsApp"
  }
];

// 4. HISTORIAL DE PAGOS Y CAJA (Páginas 4 y 5 del PDF)
export const initialPayments = [
  {
    id: "PAG-101",
    reservaId: "REV-001",
    cliente: "María González",
    monto: 3500,
    tipo: "Ingreso", // Ingreso o Egreso (para caja chica)
    metodo: "MercadoPago", // Efectivo, Transferencia, Tarjeta, MercadoPago
    estado: "Pagado", // Pagado, Pendiente, Reembolsado
    fecha: "2026-05-10"
  },
  {
    id: "PAG-102",
    reservaId: "REV-003",
    cliente: "Carolina Rodríguez",
    monto: 5000,
    tipo: "Ingreso",
    metodo: "Efectivo",
    estado: "Pagado",
    fecha: "2026-05-12"
  },
  {
    id: "PAG-103",
    reservaId: "REV-004",
    cliente: "Lucas Martínez",
    monto: 3000,
    tipo: "Egreso", // Simula la devolución por cancelación o gasto de caja chica
    metodo: "Transferencia",
    estado: "Reembolsado",
    fecha: "2026-05-11"
  },
  {
    id: "PAG-104",
    reservaId: "REV-005",
    cliente: "Tania López",
    monto: 3000,
    tipo: "Ingreso",
    metodo: "Tarjeta",
    estado: "Pagado",
    fecha: "2026-05-14"
  }
];

// 5. MÉTRICAS FINANCIERAS INICIALES (Para las KPI Cards globales del Analista)
export const initialFinancialMetrics = {
  totalRecaudadoHoy: 11500,
  movimientoCajaChica: 7500,
  totalSemanal: 11500,
  totalMensual: 30000
};

// 6. CONTROL DE INFRAESTRUCTURA (Para la auditoría del Analista de Aplicaciones)
export const initialSystemStatus = {
  bookneticApi: "ONLINE", // ONLINE, OFFLINE
  autoPayGateway: "ONLINE",
  lastSync: "Hace 5 minutos"
};