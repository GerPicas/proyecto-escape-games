import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import DateSelector from './components/DateSelector/DateSelector';
import DispoGrid from './components/DispoGrid/DispoGrid';
import MetricCard from '../../components/MetricCard/MetricCard';
import './Reservas.css';

export default function Reservas() {
  // Consumimos el estado global real
  const { reservations = [], fechaAuditoria } = useContext(AppContext);

  // States para la barra de herramientas (Buscador y filtro por estado)
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');

  // ---- FUNCIÓN AUXILIAR PARA NORMALIZAR Y COMPARAR LAS FECHAS ----
  // Convierte "AAAA-MM-DD" (de fechaAuditoria) y "D/M/AAAA" o "DD/MM/AAAA" (de la reserva) a un timestamp comparable
  const fechasCoinciden = (fechaReservaRaw, fechaAuditoriaRaw) => {
    if (!fechaReservaRaw || !fechaAuditoriaRaw) return false;
    
    try {
      // 1. Normalizar fecha de la reserva (ej: "10/5/2026" -> ["10", "5", "2026"])
      const partesReserva = fechaReservaRaw.split('/');
      if (partesReserva.length !== 3) return false;
      const diaR = parseInt(partesReserva[0], 10);
      const mesR = parseInt(partesReserva[1], 10) - 1; // Base 0 para meses en JS
      const añoR = parseInt(partesReserva[2], 10);
      const timestampReserva = new Date(añoR, mesR, diaR).setHours(0,0,0,0);

      // 2. Normalizar fecha de auditoría (ej: "2026-06-21" -> ["2026", "06", "21"])
      const partesAuditoria = fechaAuditoriaRaw.split('-');
      if (partesAuditoria.length !== 3) return false;
      const añoA = parseInt(partesAuditoria[0], 10);
      const mesA = parseInt(partesAuditoria[1], 10) - 1;
      const diaA = parseInt(partesAuditoria[2], 10);
      const timestampAuditoria = new Date(añoA, mesA, diaA).setHours(0,0,0,0);

      return timestampReserva === timestampAuditoria;
    } catch (e) {
      return false;
    }
  };

  // ---- CÁLCULO DE MÉTRICAS OPERATIVAS (Basadas en la fecha seleccionada en el DateSelector) ----
  const reservasDelDiaEscogido = reservations.filter(res => 
    fechasCoinciden(res.fecha, fechaAuditoria)
  );

  const cantConfirmadas = reservasDelDiaEscogido.filter(res => res.estado === 'Confirmada').length;
  const cantCanceladas = reservasDelDiaEscogido.filter(res => res.estado === 'Cancelada').length;
  const cantCompletadas = reservasDelDiaEscogido.filter(res => res.estado === 'Completada').length;

  // ---- FILTRADO DEL LISTADO HISTÓRICO GENERAL DE LA TABLA ----
  const reservasFiltradasParaTabla = reservations.filter(res => {
    const texto = busqueda.toLowerCase();
    const matchesTexto = 
      res.cliente?.toLowerCase().includes(texto) ||
      res.sala?.toLowerCase().includes(texto) ||
      res.id?.toLowerCase().includes(texto) ||
      res.telefono?.toLowerCase().includes(texto);

    const matchesEstado = estadoFiltro === 'Todos' || res.estado === estadoFiltro;

    return matchesTexto && matchesEstado;
  });

  return (
    <div className="reservas-view-container">
      
      {/* HEADER PRINCIPAL */}
      <header className="reservas-header">
        <div className="header-left">
          <h1>Gestión de Reservas</h1>
          <p className="subtitle">Administrá todas las reservas del sistema</p>
        </div>
      </header>

      {/* METRICAS SUPERIORES DE RECUENTO DEL DÍA SELECCIONADO */}
      <div className="reservas-metrics-grid" >
        <MetricCard 
          label="Confirmada" 
          value={cantConfirmadas} 
          variant="green" 
        />
        <MetricCard 
          label="Cancelada" 
          value={cantCanceladas} 
          variant="orange" 
        />
        <MetricCard 
          label="Completada" 
          value={cantCompletadas} 
          variant="blue" 
        />
      </div>

      {/* BARRA DE FILTROS Y BUSCADOR DEL LISTADO GENERAL */}
      <div className="table-tools-bar">
        <div className="search-input-wrapper">
          <i className="fa-solid fa-magnifying-glass icon-search"></i>
          <input 
            type="text" 
            placeholder="Buscar por cliente, sala o ID de reserva..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-search"
          />
        </div>

        <div className="tools-right">
          <select 
            value={estadoFiltro} 
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="select-filter"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <button className="btn-exportar">
            <i className="fa-solid fa-download"></i> Exportar
          </button>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE DATOS (Muestra registros históricos generales o filtrados) */}
      <div className="table-container">
        <div className="table-header-title">
          Listado de Reservas <span className="table-count">({reservasFiltradasParaTabla.length})</span>
        </div>
        <table className="reservas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Sala</th>
              <th>Fecha y Hora</th>
              <th>Personas</th>
              <th>Estado</th>
              <th>Pago</th>
              <th>Canal</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradasParaTabla.length > 0 ? (
              reservasFiltradasParaTabla.map((res) => (
                <tr key={res.id}>
                  <td className="txt-id">{res.id}</td>
                  <td>
                    <div className="customer-cell">
                      <strong className="customer-fullname">{res.cliente}</strong>
                      <span className="customer-phone">{res.telefono || '+54 11 0000-0000'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="sala-cell">
                      <strong className="sala-name">{res.sala}</strong>
                      <span className="sala-category">Clasificación</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <strong className="date-day">{res.fecha}</strong>
                      <span className="date-hours">{res.hora}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="pax-tag">
                      <i className="fa-solid fa-user-group icon-pax"></i> {res.personas}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status ${res.estado?.toLowerCase() || 'confirmada'}`}>
                      <span className="status-indicator-dot"></span> {res.estado}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-pago ${res.pago?.toLowerCase() === 'pagado' ? 'pagado' : 'pendiente'}`}>
                      <i className="fa-solid fa-wallet icon-wallet"></i> {res.pago}
                    </span>
                  </td>
                  <td>
                    <span className="channel-tag">
                      {res.canal}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="actions-cell">
                      <button className="btn-action view" title="Ver detalle"><i className="fa-solid fa-eye"></i></button>
                      <button className="btn-action edit" title="Editar"><i className="fa-solid fa-pen"></i></button>
                      <button className="btn-action delete" title="Eliminar"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data-msg">No se encontraron registros que coincidan con la búsqueda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SECCIÓN INFERIOR: MATRIZ PRODUCTIVA (Ubicada debajo de la tabla por solicitud explícita) */}
      <section className="matriz-operativa-section">
        <div className="matriz-header-row">
          <h2>Matriz Operativa del Día</h2>
          <DateSelector />
        </div>
        {/* Renderizado de la grilla de celdas horarias */}
        <DispoGrid fechasCoinciden={fechasCoinciden} />
      </section>

    </div>
  );
}

