// src/views/Inicio/Inicio.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

// Importación del componente real con sus props exactas: label y value
import MetricCard from '../../components/MetricCard/MetricCard';

// Importación de Subcomponentes locales
import Calendario from './components/Calendario/Calendario';
import InfraStatus from './components/InfraStatus/InfraStatus';

import './Inicio.css';

export default function Inicio() {
  const { currentUser, reservations = [] } = useContext(AppContext);

  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaHoyStr = new Date().toLocaleDateString('es-AR', opcionesFecha);

  // ESTADO DE JORNADA AUDITADA: Arranca con la primera fecha con reservas
  const [fechaAuditoria, setFechaAuditoria] = useState(() => {
    return reservations.length > 0 ? reservations[0].fecha : new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    if (reservations.length > 0 && !reservations.some(r => r.fecha === fechaAuditoria)) {
      setFechaAuditoria(reservations[0].fecha);
    }
  }, [reservations]);

  // FILTROS OPERATIVOS DIÁMICOS
  const turnosDeHoy = reservations.filter(res => res.fecha === fechaAuditoria);

  const totalHoy = turnosDeHoy.length;
  const confirmadosHoy = turnosDeHoy.filter(res => res.estado === 'Confirmada').length;
  const pendientesHoy = turnosDeHoy.filter(res => res.pago === 'No Pagado' && res.estado !== 'Cancelada').length;

  return (
    <div className="inicio-scroll-wrapper">
      <div className="inicio-container">
        {/* Encabezado Principal */}
        <header className="inicio-header">
          <h1 className="inicio-title">Control de Operaciones</h1>
          <p className="inicio-date">{fechaHoyStr.charAt(0).toUpperCase() + fechaHoyStr.slice(1)}</p>
          <p className="inicio-welcome">
            Sesión activa: <strong>{currentUser?.nombre || 'Usuario'}</strong> ({currentUser?.rol || 'OPERADOR'})
            <span className="audit-badge">
              [Jornada Auditada: {fechaAuditoria}]
            </span>
          </p>
        </header>

        {/* BLOQUE 1: Resumen de Turnos Diarios usando TU MetricCard */}
        <section className="dashboard-section">
          <h2 className="section-title">Turnos de la Jornada</h2>
          <div className="operaciones-grid">
            <MetricCard 
              label="Turnos Totales" 
              value={totalHoy} 
              variant='blue'
            />
            <MetricCard 
              label="Confirmados" 
              value={confirmadosHoy}
              variant='green' 
            />
            <MetricCard 
              label="Por Cobrar / Pendientes" 
              value={pendientesHoy}
              variant='orange' 
            />
          </div>
        </section>

        {/* BLOQUE 2: Calendario Integrado de Control */}
        <Calendario 
          reservations={reservations} 
          fechaAuditoria={fechaAuditoria} 
          setFechaAuditoria={setFechaAuditoria} 
        />

        {/* BLOQUE 3: Estado Técnico e Infraestructura */}
        <InfraStatus />
      </div>
    </div>
  );
}