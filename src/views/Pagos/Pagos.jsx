// src/views/Pagos/Pagos.jsx
import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import CajaChica from './components/CajaChica/CajaChica';
import './Pagos.css';

const ESTADOS_PAGO = ['Pagado', 'Pendiente', 'Reembolsado'];
const METODOS_PAGO = ['Efectivo', 'Transferencia', 'Tarjeta', 'MercadoPago'];

const estadoBadge = (estado) => {
  const map = {
    Pagado: 'badge badge--pagado',
    Pendiente: 'badge badge--pendiente',
    Reembolsado: 'badge badge--reembolsado',
  };
  return map[estado] || 'badge';
};

const tipoBadge = (tipo) => {
  return tipo === 'Ingreso' ? 'badge badge--ingreso' : 'badge badge--egreso';
};

export default function Pagos() {
  const { payments, setPayments, metrics, triggerToast } = useContext(AppContext);

  const [modalEditar, setModalEditar] = useState(null);
  const [formEditar, setFormEditar] = useState({});
  const [tabActiva, setTabActiva] = useState('movimientos'); // 'movimientos' | 'caja'

  const abrirEditar = (pago) => {
    setFormEditar({ ...pago });
    setModalEditar(pago);
  };

  const guardarEdicion = () => {
    setPayments((prev) =>
      prev.map((p) => (p.id === formEditar.id ? { ...formEditar } : p))
    );
    setModalEditar(null);
    triggerToast('✅ Pago actualizado correctamente');
  };

  const totalIngresos = payments
    .filter((p) => p.tipo === 'Ingreso' && p.estado === 'Pagado')
    .reduce((acc, p) => acc + p.monto, 0);

  const totalEgresos = payments
    .filter((p) => p.tipo === 'Egreso')
    .reduce((acc, p) => acc + p.monto, 0);

  return (
    <div className="pagos-container">
      {/* Header */}
      <div className="pagos-header">
        <div>
          <h1 className="pagos-title">Pagos</h1>
          <p className="pagos-subtitle">Control administrativo de transacciones</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="pagos-kpis">
        <div className="kpi-card kpi-card--ingreso">
          <span className="kpi-label">Total Ingresos</span>
          <span className="kpi-value">$ {totalIngresos.toLocaleString('es-AR')}</span>
        </div>
        <div className="kpi-card kpi-card--egreso">
          <span className="kpi-label">Total Egresos</span>
          <span className="kpi-value">$ {totalEgresos.toLocaleString('es-AR')}</span>
        </div>
        <div className="kpi-card kpi-card--neto">
          <span className="kpi-label">Neto</span>
          <span className="kpi-value">$ {(totalIngresos - totalEgresos).toLocaleString('es-AR')}</span>
        </div>
        <div className="kpi-card kpi-card--semanal">
          <span className="kpi-label">Total Semanal</span>
          <span className="kpi-value">$ {metrics.totalSemanal.toLocaleString('es-AR')}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="pagos-tabs">
        <button
          className={`tab-btn ${tabActiva === 'movimientos' ? 'tab-btn--active' : ''}`}
          onClick={() => setTabActiva('movimientos')}
        >
          Movimientos
        </button>
        <button
          className={`tab-btn ${tabActiva === 'caja' ? 'tab-btn--active' : ''}`}
          onClick={() => setTabActiva('caja')}
        >
          Caja Chica
        </button>
      </div>

      {tabActiva === 'movimientos' ? (
        <div className="tabla-wrapper">
          <table className="tabla-pagos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reserva</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Tipo</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="tabla-empty">No hay pagos registrados</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td className="td-id">{p.id}</td>
                    <td className="td-id">{p.reservaId}</td>
                    <td className="td-cliente">{p.cliente}</td>
                    <td className="td-monto">$ {p.monto.toLocaleString('es-AR')}</td>
                    <td>
                      <span className={tipoBadge(p.tipo)}>{p.tipo}</span>
                    </td>
                    <td>{p.metodo}</td>
                    <td>
                      <span className={estadoBadge(p.estado)}>{p.estado}</span>
                    </td>
                    <td>{p.fecha}</td>
                    <td>
                      <button
                        className="accion-btn accion-btn--editar"
                        title="Editar pago"
                        onClick={() => abrirEditar(p)}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <CajaChica payments={payments} />
      )}

      {/* ── MODAL EDITAR PAGO ── */}
      {modalEditar && (
        <div className="modal-overlay" onClick={() => setModalEditar(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Pago</h2>
              <button className="modal-close" onClick={() => setModalEditar(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label className="form-label">Cliente</label>
                  <input
                    className="form-input"
                    value={formEditar.cliente}
                    onChange={(e) => setFormEditar({ ...formEditar, cliente: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Monto</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formEditar.monto}
                    onChange={(e) => setFormEditar({ ...formEditar, monto: Number(e.target.value) })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Tipo</label>
                  <select
                    className="form-input"
                    value={formEditar.tipo}
                    onChange={(e) => setFormEditar({ ...formEditar, tipo: e.target.value })}
                  >
                    <option>Ingreso</option>
                    <option>Egreso</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Método de pago</label>
                  <select
                    className="form-input"
                    value={formEditar.metodo}
                    onChange={(e) => setFormEditar({ ...formEditar, metodo: e.target.value })}
                  >
                    {METODOS_PAGO.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-input"
                    value={formEditar.estado}
                    onChange={(e) => setFormEditar({ ...formEditar, estado: e.target.value })}
                  >
                    {ESTADOS_PAGO.map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formEditar.fecha}
                    onChange={(e) => setFormEditar({ ...formEditar, fecha: e.target.value })}
                  />
                </div>
              </div>

              {/* Resumen de estados y métodos */}
              <div className="metodos-legend">
                <p className="legend-title">Estados disponibles</p>
                <div className="legend-badges">
                  <span className="badge badge--pagado">Pagado</span>
                  <span className="badge badge--pendiente">Pendiente</span>
                  <span className="badge badge--reembolsado">Reembolsado</span>
                </div>
              </div>
              <div className="metodos-legend">
                <p className="legend-title">Métodos de pago</p>
                <div className="legend-badges">
                  {METODOS_PAGO.map((m) => (
                    <span key={m} className="badge badge--metodo">{m}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalEditar(null)}>Cancelar</button>
              <button className="btn-primary" onClick={guardarEdicion}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}