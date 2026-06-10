// src/views/Reservas/components/DispoGrid/DispoGrid.jsx
import React, { useContext } from 'react';
import { AppContext } from '../../../../context/AppContext';
import './DispoGrid.css';

const HORAS = [
  '09:00','10:00','11:00','12:00','13:00','14:00',
  '15:00','16:00','17:00','18:00','19:00','20:00','21:00',
];

const MESES = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre'
];

const DIAS_SEMANA = [
  'Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'
];

function getSalas(reservations) {
  return [...new Set(reservations.map((r) => r.sala).filter(Boolean))].sort();
}

// Normaliza hora: "19:30" → "19:00"
function normalizarHora(horaStr) {
  if (!horaStr) return null;
  const h = parseInt(horaStr.split(':')[0], 10);
  return isNaN(h) ? null : `${String(h).padStart(2,'0')}:00`;
}

// Parsea fecha en cualquier formato (ISO o con barras) → timestamp comparable
function parsearFecha(str) {
  if (!str) return null;
  if (str.includes('-')) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d).setHours(0,0,0,0);
  }
  if (str.includes('/')) {
    const [d, m, y] = str.split('/').map(Number);
    return new Date(y, m - 1, d).setHours(0,0,0,0);
  }
  return null;
}

function isoALabel(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${DIAS_SEMANA[date.getDay()]}, ${d} de ${MESES[m - 1]} de ${y}`;
}

export default function DispoGrid() {
  // DispoGrid usa su propio parsearFecha — ya no depende del prop fechasCoinciden
  const { reservations = [], fechaAuditoria } = useContext(AppContext);

  const salas = getSalas(reservations);

  const tsAuditoria = parsearFecha(fechaAuditoria);

  const reservasDelDia = reservations.filter((r) => {
    const ts = parsearFecha(r.fecha);
    return ts !== null && tsAuditoria !== null && ts === tsAuditoria;
  });

  // Índice: "Sala|HH:00" → reserva
  const idx = {};
  reservasDelDia.forEach((r) => {
    const h = normalizarHora(r.hora);
    if (h) idx[`${r.sala}|${h}`] = r;
  });

  const estadoClass = {
    Confirmada: 'celda--confirmada',
    Completada: 'celda--completada',
    Cancelada:  'celda--cancelada',
  };

  return (
    <div className="dg-wrapper">

      {/* ── Subtítulo del día ── */}
      <p className="dg-dia-label">
        {fechaAuditoria
          ? <><strong>{isoALabel(fechaAuditoria)}</strong> · {reservasDelDia.length} reserva{reservasDelDia.length !== 1 ? 's' : ''}</>
          : 'Seleccioná una fecha para ver la disponibilidad'}
      </p>

      {/* ── Leyenda ── */}
      <div className="dg-leyenda">
        {[
          { clase: 'leyenda--libre',      label: 'Libre' },
          { clase: 'leyenda--confirmada', label: 'Confirmada' },
          { clase: 'leyenda--completada', label: 'Completada' },
          { clase: 'leyenda--cancelada',  label: 'Cancelada' },
        ].map(({ clase, label }) => (
          <span key={label} className="dg-leyenda-item">
            <span className={`dg-leyenda-dot ${clase}`} />
            {label}
          </span>
        ))}
      </div>

      {/* ── Grilla ── */}
      <div className="dg-scroll">
        <table className="dg-table">
          <thead>
            <tr>
              <th className="dg-th dg-th--sala">Sala</th>
              {HORAS.map((h) => <th key={h} className="dg-th">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {salas.length === 0 ? (
              <tr>
                <td colSpan={HORAS.length + 1} className="dg-empty">
                  No hay salas en el sistema.
                </td>
              </tr>
            ) : salas.map((sala) => (
              <tr key={sala}>
                <td className="dg-sala">{sala}</td>
                {HORAS.map((hora) => {
                  const res = idx[`${sala}|${hora}`];
                  return (
                    <td
                      key={hora}
                      className={`dg-celda ${res ? (estadoClass[res.estado] || '') : 'celda--libre'}`}
                      title={res ? `${res.cliente} · ${res.personas} pax · ${res.estado}` : 'Libre'}
                    >
                      {res ? (
                        <div className="dg-celda-content">
                          <span className="dg-celda-cliente">{res.cliente.split(' ')[0]}</span>
                          <span className="dg-celda-pax">{res.personas} pax</span>
                        </div>
                      ) : (
                        <span className="dg-celda-libre">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensaje si no hay reservas */}
      {reservasDelDia.length === 0 && fechaAuditoria && (
        <p className="dg-sin-reservas">
          No hay reservas para este día. Todas las salas están libres.
        </p>
      )}
    </div>
  );
}