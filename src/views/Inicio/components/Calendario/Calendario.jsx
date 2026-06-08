// src/views/Inicio/components/Calendario/Calendario.jsx
import React, { useState } from 'react';
import './Calendario.css';

export default function Calendario({ reservations = [] }) {
  // Inicializamos el calendario con la fecha actual del sistema (Junio 2026)
  const [fechaBase, setFechaBase] = useState(new Date());
  const [vista, setVista] = useState('Semana');

  const año = fechaBase.getFullYear();
  const mes = fechaBase.getMonth(); // 0 = Enero, 5 = Junio, etc.

  // ---- LÓGICA DEL MINI CALENDARIO MENSUAL ----
  const nombreMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const totalDiasMes = new Date(año, mes + 1, 0).getDate();
  let primerDiaSemana = new Date(año, mes, 1).getDay();
  primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1; // Ajuste Lunes a Domingo

  const diasMesArray = Array.from({ length: totalDiasMes }, (_, i) => i + 1);
  const espaciosVacios = Array.from({ length: primerDiaSemana }, (_, i) => i);

  const mesAnterior = () => setFechaBase(new Date(año, mes - 1, 1));
  const mesSiguiente = () => setFechaBase(new Date(año, mes + 1, 1));

  // ---- LÓGICA DE LA GRILLA SEMANAL ----
  const obtenerDiasSemanaActual = () => {
    const dias = [];
    const fechaAux = new Date(fechaBase);
    const diaSemanaActual = fechaAux.getDay();
    const diferenciaALunes = diaSemanaActual === 0 ? -6 : 1 - diaSemanaActual;
    
    fechaAux.setDate(fechaAux.getDate() + diferenciaALunes);
    const nombresDiasCortos = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    for (let i = 0; i < 7; i++) {
      const añoStr = fechaAux.getFullYear();
      const mesStr = String(fechaAux.getMonth() + 1).padStart(2, '0');
      const diaStr = String(fechaAux.getDate()).padStart(2, '0');
      
      dias.push({
        nombre: nombresDiasCortos[i],
        numero: fechaAux.getDate(),
        fechaStr: `${añoStr}-${mesStr}-${diaStr}`,
        esHoy: new Date().toDateString() === fechaAux.toDateString()
      });
      fechaAux.setDate(fechaAux.getDate() + 1);
    }
    return dias;
  };

  const diasSemana = obtenerDiasSemanaActual();
  const horas = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

// FILTRADO ULTRA-ROBUSTO: Elimina duplicados idénticos en caliente por ID
  const obtenerReservasCelda = (fechaStr, hora) => {
    const encontradas = reservations.filter(res => {
      if (!res.fecha || !res.hora) return false;
      const horaInicioReserva = res.hora.split(' ')[0].trim();
      return res.fecha.trim() === fechaStr.trim() && horaInicioReserva === hora.trim();
    });

    // Filtramos para dejar solo elementos con IDs únicos en este slot
    const idsVistos = new Set();
    return encontradas.filter(res => {
      if (idsVistos.has(res.id)) {
        return false; // Si el ID ya se dibujó en la celda, lo vuela
      }
      idsVistos.add(res.id);
      return true;
    });
  };

  const semanaAnterior = () => {
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    setFechaBase(nuevaFecha);
  };

  const semanaSiguiente = () => {
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    setFechaBase(nuevaFecha);
  };

  const diaTieneReservas = (dia) => {
    const mesStr = String(mes + 1).padStart(2, '0');
    const diaStr = String(dia).padStart(2, '0');
    const targetFecha = `${año}-${mesStr}-${diaStr}`;
    return reservations.some(res => res.fecha === targetFecha);
  };

  return (
    <div className="calendario-reservas-container">
      <div className="cal-main-header">
        <h2>Calendario de Reservas</h2>
        <div className="toggle-vista-buttons">
          <button type="button" className={vista === 'Día' ? 'active' : ''} onClick={() => setVista('Día')}>Día</button>
          <button type="button" className={vista === 'Semana' ? 'active' : ''} onClick={() => setVista('Semana')}>Semana</button>
        </div>
      </div>

      <div className="cal-layout-grid">
        {/* COLUMNA IZQUIERDA */}
        <aside className="cal-sidebar-left">
          <div className="mini-month-header">
            <button type="button" className="arrow-btn" onClick={mesAnterior}>&lt;</button>
            <span>{nombreMeses[mes]} {año}</span>
            <button type="button" className="arrow-btn" onClick={mesSiguiente}>&gt;</button>
          </div>
          
          <div className="mini-days-grid-labels">
            <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
          </div>
          
          <div className="mini-days-grid">
            {espaciosVacios.map(i => (
              <span key={`empty-${i}`} className="empty-day"></span>
            ))}
            
            {diasMesArray.map(dia => {
              const tieneTurno = diaTieneReservas(dia);
              const perteneceASemanaActual = diasSemana.some(d => d.numero === dia && new Date(d.fechaStr).getMonth() === mes);
              
              // IDENTIFICACIÓN DE HOY: Comparamos día, mes y año actuales
              const hoyObjeto = new Date();
              const esHoySistema = hoyObjeto.getDate() === dia && hoyObjeto.getMonth() === mes && hoyObjeto.getFullYear() === año;

              return (
                <span 
                  key={dia} 
                  className={`mini-day-cell 
                    ${tieneTurno ? 'con-reserva' : ''} 
                    ${perteneceASemanaActual ? 'highlight-orange' : ''} 
                    ${esHoySistema ? 'es-hoy-sistema' : ''}`}
                >
                  {dia}
                </span>
              );
            })}
          </div>

          <div className="cal-legend">
            <h4>Estados</h4>
            <div className="legend-item"><span className="dot orange"></span> Confirmada</div>
            <div className="legend-item"><span className="dot blue"></span> Completada</div>
            <div className="legend-item"><span className="dot gray"></span> Cancelada</div>
          </div>
        </aside>

        {/* COLUMNA DERECHA */}
        <section className="cal-agenda-main">
          <div className="agenda-week-subheader">
            <div className="week-info-title">
              <h3>Semana del {diasSemana[0]?.numero} al {diasSemana[6]?.numero} de {nombreMeses[new Date(diasSemana[0]?.fechaStr).getMonth()]}</h3>
              <p>Monitoreo dinámico del flujo operacional</p>
            </div>
            <div className="week-navigation-controls">
              <button type="button" className="arrow-btn" onClick={semanaAnterior}>&lt;</button>
              <span className="current-week-label" style={{ cursor: 'pointer' }} onClick={() => setFechaBase(new Date())}>Hoy</span>
              <button type="button" className="arrow-btn" onClick={semanaSiguiente}>&gt;</button>
            </div>
          </div>

          <div className="agenda-table-wrapper">
            <table className="agenda-table">
              <thead>
                <tr>
                  <th className="time-col-header"></th>
                  {diasSemana.map(d => (
                    <th key={d.fechaStr} className={d.esHoy ? 'today-col-header' : ''}>
                      <div className="day-name">{d.nombre}</div>
                      <div className={`day-number-badge ${d.esHoy ? 'active-today' : ''}`}>{d.numero}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horas.map(hora => (
                  <tr key={hora}>
                    <td className="time-cell">{hora}</td>
                    {diasSemana.map(d => {
                      const reservasEnCelda = obtenerReservasCelda(d.fechaStr, hora);
                      return (
                        <td key={d.fechaStr} className="agenda-slot-cell">
                          {reservasEnCelda.map((res, index) => {
                            let estadoClase = 'card-orange'; 
                            if (res.estado === 'Completada') estadoClase = 'card-blue';
                            if (res.estado === 'Cancelada') estadoClase = 'card-gray';

                            return (
                              <div key={res.id || index} className={`reservation-agenda-card ${estadoClase}`}>
                                <div className="res-time-box">{res.hora || '14:00'}</div>
                                <div className="res-client-name">{res.cliente}</div>
                                <div className="res-room-name">{res.sala}</div>
                              </div>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}