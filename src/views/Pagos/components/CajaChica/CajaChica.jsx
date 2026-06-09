// src/views/Pagos/components/CajaChica/CajaChica.jsx
import React, { useState } from 'react';
import './CajaChica.css';

export default function CajaChica({ payments }) {
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  const filtrados = payments.filter((p) =>
    filtroTipo === 'Todos' ? true : p.tipo === filtroTipo
  );

  const totalIngresos = payments
    .filter((p) => p.tipo === 'Ingreso')
    .reduce((acc, p) => acc + p.monto, 0);

  const totalEgresos = payments
    .filter((p) => p.tipo === 'Egreso')
    .reduce((acc, p) => acc + p.monto, 0);

  return (
    <div className="caja-container">
      <div className="caja-header">
        <div className="caja-resumen">
          <div className="caja-resumen-item">
            <span className="caja-resumen-label">Ingresos</span>
            <span className="caja-resumen-value caja-resumen-value--pos">
              + $ {totalIngresos.toLocaleString('es-AR')}
            </span>
          </div>
          <div className="caja-divider" />
          <div className="caja-resumen-item">
            <span className="caja-resumen-label">Egresos</span>
            <span className="caja-resumen-value caja-resumen-value--neg">
              − $ {totalEgresos.toLocaleString('es-AR')}
            </span>
          </div>
          <div className="caja-divider" />
          <div className="caja-resumen-item">
            <span className="caja-resumen-label">Saldo</span>
            <span className={`caja-resumen-value ${totalIngresos - totalEgresos >= 0 ? 'caja-resumen-value--pos' : 'caja-resumen-value--neg'}`}>
              $ {(totalIngresos - totalEgresos).toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Filtro tipo */}
        <div className="caja-filtros">
          {['Todos', 'Ingreso', 'Egreso'].map((t) => (
            <button
              key={t}
              className={`caja-filtro-btn ${filtroTipo === t ? 'caja-filtro-btn--active' : ''}`}
              onClick={() => setFiltroTipo(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de movimientos */}
      <div className="caja-lista">
        {filtrados.length === 0 ? (
          <div className="caja-empty">No hay movimientos para mostrar</div>
        ) : (
          filtrados.map((p) => (
            <div key={p.id} className="caja-item">
              <div className="caja-item-icono">
                {p.tipo === 'Ingreso' ? '↑' : '↓'}
              </div>
              <div className="caja-item-info">
                <span className="caja-item-cliente">{p.cliente}</span>
                <span className="caja-item-meta">
                  {p.metodo} · {p.fecha} · {p.reservaId}
                </span>
              </div>
              <div className="caja-item-right">
                <span className={`caja-item-monto ${p.tipo === 'Ingreso' ? 'caja-monto--pos' : 'caja-monto--neg'}`}>
                  {p.tipo === 'Ingreso' ? '+' : '−'} $ {p.monto.toLocaleString('es-AR')}
                </span>
                <span className={`caja-item-estado caja-estado--${p.estado.toLowerCase()}`}>
                  {p.estado}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}