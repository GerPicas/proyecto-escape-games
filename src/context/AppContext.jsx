// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { 
  initialUsers, 
  initialReservations, 
  initialPayments, 
  initialFinancialMetrics, 
  initialSystemStatus 
} from '../data/mockData';

// Creamos el contexto
export const AppContext = createContext();

// Creamos el Proveedor (Provider) que va a envolver a toda la aplicación
export const AppProvider = ({ children }) => {
  
  // --- ESTADOS DE DATOS (Persistidos en LocalStorage) ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('er_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('er_reservations');
    return saved ? JSON.parse(saved) : initialReservations;
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

  // --- ESTADOS DE CONTROL (Navegación, Autenticación y Alertas) ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('er_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [currentView, setCurrentView] = useState('INICIO'); 
  const [toastMessage, setToastMessage] = useState('');

  // --- EFECTOS PARA GUARDAR EN LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem('er_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('er_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('er_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('er_metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('er_system_status', JSON.stringify(systemStatus));
  }, [systemStatus]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('er_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('er_current_user');
    }
  }, [currentUser]);

  // --- EFECTO ADICIONAL: Resetear scroll al cambiar de vista ---
  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTop = 0;
  }, [currentView]);

  // --- FUNCIONES GLOBALES COMPARTIDAS ---
  const triggerToast = (msg) => {
    setToastMessage(msg);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('INICIO'); // Resetea la vista por defecto para el próximo login
  };

  // Todo lo que metamos en el 'value' va a estar accesible globalmente
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
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};