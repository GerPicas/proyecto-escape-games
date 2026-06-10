// src/views/Pagos/Pagos.jsx
import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import CajaChica from './components/CajaChica/CajaChica';
import './Pagos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const ESTADOS_PAGO = ['Pagado', 'Pendiente', 'Reembolsado'];
const METODOS_PAGO = ['Efectivo', 'Transferencia', 'Tarjeta', 'MercadoPago'];

const estadoClass = (e) => ({
  Pagado:      'badge badge--pagado',
  Pendiente:   'badge badge--pendiente',
  Reembolsado: 'badge badge--reembolsado',
}[e] || 'badge');

const tipoClass = (t) =>
  t === 'Ingreso' ? 'badge badge--ingreso' : 'badge badge--egreso';

const FORM_VACIO = { cliente: '', reservaId: '', monto: '', tipo: 'Ingreso', metodo: 'Efectivo', estado: 'Pendiente', fecha: '' };

export default function Pagos() {
  const { payments, setPayments, metrics, reservations, triggerToast } = useContext(AppContext);

  const [tab, setTab]                 = useState('movimientos');
  const [modalEditar, setModalEditar] = useState(null);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [formEditar, setFormEditar]   = useState({});
  const [formNuevo, setFormNuevo]     = useState(FORM_VACIO);

  /* ── Editar ── */
  const abrirEditar = (p) => { setFormEditar({ ...p }); setModalEditar(p); };
  const guardarEdicion = () => {
    setPayments((prev) => prev.map((p) => p.id === formEditar.id ? { ...formEditar } : p));
    setModalEditar(null);
    triggerToast('Pago actualizado correctamente');
  };

  /* ── Agregar ── */
  const guardarNuevo = () => {
    if (!formNuevo.cliente || !formNuevo.monto || !formNuevo.fecha) {
      triggerToast('Completá cliente, monto y fecha'); return;
    }
    const nuevo = {
      ...formNuevo,
      id: `PAG-${Date.now()}`,
      monto: Number(formNuevo.monto),
    };
    setPayments((prev) => [nuevo, ...prev]);
    setModalAgregar(false);
    setFormNuevo(FORM_VACIO);
    triggerToast('Pago registrado correctamente');
  };

  const totalIngresos = payments.filter((p) => p.tipo === 'Ingreso' && p.estado === 'Pagado').reduce((a, p) => a + p.monto, 0);
  const totalEgresos  = payments.filter((p) => p.tipo === 'Egreso').reduce((a, p) => a + p.monto, 0);

  return (
    <div className="pg-container">

      {/* ── Header ── */}
      <div className="pg-header">
        <div>
          <h1 className="pg-title">Pagos</h1>
          <p className="pg-subtitle">Control administrativo de transacciones</p>
        </div>
        <button className="btn-primary" onClick={() => setModalAgregar(true)}>
          + Registrar pago
        </button>
      </div>

      {/* ── KPIs ── */}
      <div className="pg-kpis">
        {[
          { label: 'Ingresos',      value: totalIngresos,                accent: '#22c55e' },
          { label: 'Egresos',       value: totalEgresos,                 accent: '#ef4444' },
          { label: 'Neto',          value: totalIngresos - totalEgresos, accent: '#6366f1' },
          { label: 'Total Semanal', value: metrics?.totalSemanal ?? 0,   accent: '#3b82f6' },
        ].map(({ label, value, accent }) => (
          <div key={label} className="pg-kpi" style={{ borderLeftColor: accent }}>
            <span className="pg-kpi-label">{label}</span>
            <span className="pg-kpi-value">$ {value.toLocaleString('es-AR')}</span>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="pg-tabs">
        {['movimientos', 'caja'].map((t) => (
          <button key={t} className={`pg-tab ${tab === t ? 'pg-tab--active' : ''}`} onClick={() => setTab(t)}>
            {t === 'movimientos' ? 'Movimientos' : 'Caja Chica'}
          </button>
        ))}
      </div>

      {/* ── Tabla movimientos ── */}
      {tab === 'movimientos' ? (
        <div className="pg-tabla-wrapper">
          <table className="pg-tabla">
            <thead>
              <tr>
                <th>ID</th><th>Reserva</th><th>Cliente</th><th>Monto</th>
                <th>Tipo</th><th>Método</th><th>Estado</th><th>Fecha</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={9} className="pg-empty">No hay pagos registrados</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id}>
                  <td className="td-mono">{p.id}</td>
                  <td className="td-mono">{p.reservaId}</td>
                  <td className="td-bold">{p.cliente}</td>
                  <td className="td-monto">$ {Number(p.monto).toLocaleString('es-AR')}</td>
                  <td><span className={tipoClass(p.tipo)}>{p.tipo}</span></td>
                  <td>{p.metodo}</td>
                  <td><span className={estadoClass(p.estado)}>{p.estado}</span></td>
                  <td>{p.fecha}</td>
                  <td>
                      <button className="rv-btn rv-btn--editar" title="Editar pago" onClick={() => abrirEditar(p)}>
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <CajaChica payments={payments} />
      )}

      {/* ════════ MODAL AGREGAR PAGO ════════ */}
      {modalAgregar && (
        <div className="modal-overlay" onClick={() => setModalAgregar(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Pago</h2>
              <button className="modal-close" onClick={() => setModalAgregar(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">

                {/* Cliente con sugerencias basadas en reservas */}
                <div className="form-field form-field--full">
                  <label className="form-label">Cliente</label>
                  <input
                    className="form-input"
                    placeholder="Nombre del cliente"
                    list="clientes-list"
                    value={formNuevo.cliente}
                    onChange={(e) => setFormNuevo({ ...formNuevo, cliente: e.target.value })}
                  />
                  <datalist id="clientes-list">
                    {[...new Set((reservations || []).map((r) => r.cliente))].map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div className="form-field">
                  <label className="form-label">ID Reserva (opcional)</label>
                  <input
                    className="form-input"
                    placeholder="Ej: RES-001"
                    list="reservas-list"
                    value={formNuevo.reservaId}
                    onChange={(e) => setFormNuevo({ ...formNuevo, reservaId: e.target.value })}
                  />
                  <datalist id="reservas-list">
                    {(reservations || []).map((r) => (
                      <option key={r.id} value={r.id} />
                    ))}
                  </datalist>
                </div>

                <div className="form-field">
                  <label className="form-label">Monto ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={formNuevo.monto}
                    onChange={(e) => setFormNuevo({ ...formNuevo, monto: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Tipo</label>
                  <select className="form-input" value={formNuevo.tipo}
                    onChange={(e) => setFormNuevo({ ...formNuevo, tipo: e.target.value })}>
                    <option>Ingreso</option>
                    <option>Egreso</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Método de pago</label>
                  <select className="form-input" value={formNuevo.metodo}
                    onChange={(e) => setFormNuevo({ ...formNuevo, metodo: e.target.value })}>
                    {METODOS_PAGO.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Estado</label>
                  <select className="form-input" value={formNuevo.estado}
                    onChange={(e) => setFormNuevo({ ...formNuevo, estado: e.target.value })}>
                    {ESTADOS_PAGO.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className="form-field form-field--full">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formNuevo.fecha}
                    onChange={(e) => setFormNuevo({ ...formNuevo, fecha: e.target.value })}
                  />
                </div>

              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalAgregar(false)}>Cancelar</button>
              <button className="btn-primary" onClick={guardarNuevo}>Registrar pago</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ MODAL EDITAR PAGO ════════ */}
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
                  <input className="form-input" value={formEditar.cliente}
                    onChange={(e) => setFormEditar({ ...formEditar, cliente: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Monto</label>
                  <input type="number" className="form-input" value={formEditar.monto}
                    onChange={(e) => setFormEditar({ ...formEditar, monto: Number(e.target.value) })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Tipo</label>
                  <select className="form-input" value={formEditar.tipo}
                    onChange={(e) => setFormEditar({ ...formEditar, tipo: e.target.value })}>
                    <option>Ingreso</option><option>Egreso</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Método de pago</label>
                  <select className="form-input" value={formEditar.metodo}
                    onChange={(e) => setFormEditar({ ...formEditar, metodo: e.target.value })}>
                    {METODOS_PAGO.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Estado</label>
                  <select className="form-input" value={formEditar.estado}
                    onChange={(e) => setFormEditar({ ...formEditar, estado: e.target.value })}>
                    {ESTADOS_PAGO.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Fecha</label>
                  <input type="date" className="form-input" value={formEditar.fecha}
                    onChange={(e) => setFormEditar({ ...formEditar, fecha: e.target.value })} />
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