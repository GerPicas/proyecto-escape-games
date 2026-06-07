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
    canal: "Web"
  },
  {
    id: "REV-002",
    cliente: "Juan Pérez",
    sala: "Laboratorio del Dr. Chaos",
    fecha: "2026-05-11",
    hora: "16:00",
    personas: 5,
    estado: "Confirmada",
    pago: "Pendiente",
    canal: "WhatsApp"
  },
  {
    id: "REV-003",
    cliente: "Carolina Rodríguez",
    sala: "La Mansión Embrujada",
    fecha: "2026-05-12",
    hora: "18:30",
    personas: 6,
    estado: "Completada",
    pago: "Pagado",
    canal: "Web"
  },
  {
    id: "REV-004",
    cliente: "Lucas Martínez",
    sala: "Atraco al Banco Central",
    fecha: "2026-05-11",
    hora: "20:00",
    personas: 3,
    estado: "Cancelada",
    pago: "Reembolsado",
    canal: "Presencial"
  },
  {
    id: "REV-005",
    cliente: "Tania López",
    sala: "Laboratorio del Dr. Chaos",
    fecha: "2026-05-14",
    hora: "15:00",
    personas: 4,
    estado: "Confirmada",
    pago: "Pagado",
    canal: "Instagram"
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