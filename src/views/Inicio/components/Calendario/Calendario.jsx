// src/views/Inicio/components/Calendario/Calendario.jsx
import React, { useState } from 'react';
import './Calendario.css';

export default function Calendario({ reservations = [] }) {
  // Inicializamos el calendario con la fecha actual del sistema
  const [fechaBase, setFechaBase] = useState(new Date());
  const [vista, setVista] = useState('Semana'); // 'Día' o 'Semana'

  const año = fechaBase.getFullYear();
  const mes = fechaBase.getMonth(); // 0 = Enero, 11 = Diciembre

  // ---- LÓGICA DEL MINI CALENDARIO MENSUAL (IZQUIERDA) ----
  const nombreMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Cantidad de días del mes actual y del mes anterior (para rellenar si querés)
  const totalDiasMes = new Date(año, mes + 1, 0).getDate();
  // Primer día del mes (0 = Domingo, 1 = Lunes, etc.) -> Lo ajustamos para que empiece en Lunes (0)
  let primerDiaSemana = new Date(año, mes, 1).getDay();
  primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1; // Ajuste Lunes a Domingo

  // Crear array de días del mes [1, 2, 3, ... totalDiasMes]
  const diasMesArray = Array.from({ length: totalDiasMes }, (_, i) => i + 1);
  // Crear casilleros vacíos para el desfasaje del inicio de mes
  const espaciosVacios = Array.from({ length: primerDiaSemana }, (_, i) => i);

  // Manejo de navegación de meses
  const mesAnterior = () => setFechaBase(new Date(año, mes - 1, 1));
  const mesSiguiente = () => setFechaBase(new Date(año, mes + 1, 1));


  // ---- LÓGICA DE LA GRILLA SEMANAL (DERECHA) ----
  // Calculamos los 7 días de la semana actual enfocada por el calendario
  const obtenerDiasSemanaActual = () => {
    const dias = [];
    const fechaAux = new Date(fechaBase);
    const diaSemanaActual = fechaAux.getDay();
    const diferenciaALunes = diaSemanaActual === 0 ? -6 : 1 - diaSemanaActual;
    
    // Seteamos el lunes de esta semana
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

  // Filtrado de celdas dinámico en base a los datos de reservations reales
  const obtenerReservasCelda = (fechaStr, hora) => {
    return reservations.filter(res => {
      const horaInicio = res.hora?.split(' ')[0] || res.horario?.split(' ')[0];
      return res.fecha === fechaStr && horaInicio === hora;
    });
  };

  // Navegación de semanas en la agenda principal
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

  // Verifica si un día del mini calendario mensual tiene alguna reserva registrada
  const diaTieneReservas = (dia) => {
    const mesStr = String(mes + 1).padStart(2, '0');
    const diaStr = String(dia).padStart(2, '0');
    const targetFecha = `${año}-${mesStr}-${diaStr}`;
    return reservations.some(res => res.fecha === targetFecha);
  };

  return (
    <div className="calendario-reservas-container">
      {/* Encabezado del Módulo */}
      <div className="cal-main-header">
        <h2>Calendario de Reservas</h2>
      </div>

      <div className="cal-layout-grid">
        {/* COLUMNA IZQUIERDA: Mini Calendario Mensual Autocalculado */}
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
              // Marcamos si este día pertenece a la semana que se está mostrando a la derecha
              const perteneceASemanaActual = diasSemana.some(d => d.numero === dia && new Date(d.fechaStr).getMonth() === mes);

              return (
                <span 
                  key={dia} 
                  className={`mini-day-cell ${tieneTurno ? 'con-reserva' : ''} ${perteneceASemanaActual ? 'highlight-orange' : ''}`}
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

        {/* COLUMNA DERECHA: Grilla de Agenda Semanal Dinámica */}
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