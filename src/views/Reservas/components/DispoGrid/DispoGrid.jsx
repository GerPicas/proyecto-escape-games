import React, { useContext } from 'react';
import { AppContext } from '../../../../context/AppContext';
import './DispoGrid.css';

export default function DispoGrid({ fechasCoinciden }) {
  const { reservations = [], fechaAuditoria } = useContext(AppContext);

  const SALAS = [
    "El Misterio del Faraón",
    "Laboratorio del Dr. Chaos",
    "La Mansión Embrujada",
    "Atraco al Banco Central"
  ];

  // Matriz horaria completa basada en las horas de inicio reales de tu panel operativo
  const TURNOS = [
    "10:00", "11:30", "13:00", "14:00", "14:30", "15:00", "16:00", "17:00", "17:30", "18:00", "19:00", "20:00"
  ];

  // Filtrado estricto usando la función de normalización del padre
  const turnosDelDia = reservations.filter(res => 
    fechasCoinciden(res.fecha, fechaAuditoria)
  );

  return (
    <div className="dispo-grid-container">
      <div className="grid-header-row">
        <div className="hour-corner">HORA</div>
        {SALAS.map(sala => (
          <div key={sala} className="sala-column-header">{sala}</div>
        ))}
      </div>

      <div className="grid-body">
        {TURNOS.map(hora => (
          <div key={hora} className="grid-row">
            <div className="hour-label">{hora}</div>
            {SALAS.map(sala => {
              // Validamos si la hora de la reserva empieza con la hora del slot (ej: "18:00 - 19:00" matches "18:00")
              const reserva = turnosDelDia.find(res => {
                if (!res.hora || !res.sala) return false;
                const horaInicioReserva = res.hora.split(' ')[0].trim(); // Saca el "18:00"
                return res.sala.trim() === sala.trim() && horaInicioReserva === hora;
              });

              return (
                <div 
                  key={`${sala}-${hora}`} 
                  className={`grid-slot ${reserva ? `occupied ${reserva.estado?.toLowerCase()}` : 'free'}`}
                >
                  {reserva ? (
                    <div className="slot-info">
                      <strong className="customer-name">{reserva.cliente?.split(' ')[0]}</strong>
                      <span className="pax-count">
                        <i className="fa-solid fa-user icon-user-slot"></i> {reserva.personas}p
                      </span>
                    </div>
                  ) : (
                    <span className="free-label">Disponible</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}