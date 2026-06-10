// src/context/AppContext.jsx
import { createContext, useState, useEffect } from 'react';
import { 
  initialUsers, 
  initialReservations, 
  initialPayments, 
  initialFinancialMetrics, 
  initialSystemStatus 
} from '../data/mockData';

export const AppContext = createContext();

const FACTURACION_STATE_VERSION = 'facturacion-separada-de-pago-v1';

const normalizarReservas = (reservas = []) => {
  const porId = new Map();

  reservas.forEach((reserva, index) => {
    const id = reserva?.id || `REV-SIN-ID-${index + 1}`;
    porId.set(id, { ...reserva, id });
  });

  return Array.from(porId.values());
};

const limpiarEstadoFacturacion = (reservas = []) => reservas.map((reserva) => {
  const { facturado, fechaFacturacion, ...datosReserva } = reserva;
  return datosReserva;
});

const cargarReservasPersistidas = () => {
  const saved = localStorage.getItem('er_reservations');
  const reservasBase = normalizarReservas(saved ? JSON.parse(saved) : initialReservations);
  const versionFacturacion = localStorage.getItem('er_facturacion_state_version');

  if (saved && versionFacturacion !== FACTURACION_STATE_VERSION) {
    localStorage.setItem('er_facturacion_state_version', FACTURACION_STATE_VERSION);
    return limpiarEstadoFacturacion(reservasBase);
  }

  return reservasBase;
};

// Devuelve la fecha de hoy en formato "AAAA-MM-DD"
const isoHoy = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`;
};

export const AppProvider = ({ children }) => {
  
  // --- ESTADOS DE DATOS (Persistidos en LocalStorage) ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('er_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [reservations, setReservations] = useState(() => {
    return cargarReservasPersistidas();
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('er_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('er_metrics');
    return saved ? JSON.parse(saved) : initialFinancialMetrics;
  });

  const [systemStatus, setSystemStatus] = useState(() => {
    const saved = localStorage.getItem('er_system_status');
    return saved ? JSON.parse(saved) : initialSystemStatus;
  });

  // --- ESTADOS DE CONTROL ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('er_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [currentView, setCurrentView]       = useState('INICIO'); 
  const [toastMessage, setToastMessage]     = useState('');

  // ── NUEVO: fecha seleccionada en la Matriz Operativa ──────────────
  const [fechaAuditoria, setFechaAuditoria] = useState(isoHoy());
  // ─────────────────────────────────────────────────────────────────

  // --- EFECTOS LOCALSTORAGE ---
  useEffect(() => { localStorage.setItem('er_users',         JSON.stringify(users));        }, [users]);
  useEffect(() => { localStorage.setItem('er_reservations',  JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem('er_payments',      JSON.stringify(payments));     }, [payments]);
  useEffect(() => { localStorage.setItem('er_metrics',       JSON.stringify(metrics));      }, [metrics]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('er_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('er_current_user');
    }
  }, [currentUser]);

  // Reset scroll al cambiar de vista
  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTop = 0;
  }, [currentView]);

  // --- FUNCIONES GLOBALES ---
  const triggerToast = (msg) => setToastMessage(msg);

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('INICIO');
  };

  return (
    <AppContext.Provider value={{
      users, setUsers,
      reservations, setReservations,
      payments, setPayments,
      metrics, setMetrics,
      systemStatus, setSystemStatus,
      currentUser, setCurrentUser,
      currentView, setCurrentView,
      toastMessage, setToastMessage,
      triggerToast,
      logout,
      // ── NUEVO ──
      fechaAuditoria, setFechaAuditoria,
    }}>
      {children}
    </AppContext.Provider>
  );
};
