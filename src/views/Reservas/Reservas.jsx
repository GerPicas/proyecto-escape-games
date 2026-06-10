// src/views/Reservas/Reservas.jsx
import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import DateSelector from './components/DateSelector/DateSelector';
import DispoGrid from './components/DispoGrid/DispoGrid';
import MetricCard from '../../components/MetricCard/MetricCard';
import './Reservas.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Reservas() {
  const { reservations = [], setReservations, fechaAuditoria, triggerToast } = useContext(AppContext);

  const [busqueda, setBusqueda]         = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');

  // Modales
  const [modalVer, setModalVer]           = useState(null);
  const [modalEditar, setModalEditar]     = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [formEditar, setFormEditar]       = useState({});

  // ─────────────────────────────────────────────────────────────────────────────
  // fechasCoinciden: compara dos fechas independientemente de su formato.
  // Soporta:
  //   - "AAAA-MM-DD"  (ISO — formato del mockData y del DateSelector)
  //   - "D/M/AAAA" o "DD/MM/AAAA"  (formato legado con barras)
  // ─────────────────────────────────────────────────────────────────────────────
  const parsearFecha = (str) => {
    if (!str) return null;
    if (str.includes('-')) {
      // Formato ISO: "2026-06-20"
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d).setHours(0,0,0,0);
    }
    if (str.includes('/')) {
      // Formato legado: "20/6/2026" o "20/06/2026"
      const [d, m, y] = str.split('/').map(Number);
      return new Date(y, m - 1, d).setHours(0,0,0,0);
    }
    return null;
  };

  const fechasCoinciden = (fechaReserva, fechaAud) => {
    const ts1 = parsearFecha(fechaReserva);
    const ts2 = parsearFecha(fechaAud);
    return ts1 !== null && ts2 !== null && ts1 === ts2;
  };

  // ── Métricas del día seleccionado ──
  const reservasDelDia  = reservations.filter(r => fechasCoinciden(r.fecha, fechaAuditoria));
  const cantConfirmadas = reservasDelDia.filter(r => r.estado === 'Confirmada').length;
  const cantCanceladas  = reservasDelDia.filter(r => r.estado === 'Cancelada').length;
  const cantCompletadas = reservasDelDia.filter(r => r.estado === 'Completada').length;

  // ── Filtrado de tabla ──
  const reservasFiltradasParaTabla = reservations.filter(res => {
    const texto = busqueda.toLowerCase();
    const matchesTexto =
      res.cliente?.toLowerCase().includes(texto) ||
      res.sala?.toLowerCase().includes(texto) ||
      res.id?.toLowerCase().includes(texto) ||
      res.telefono?.toLowerCase().includes(texto);
    return matchesTexto && (estadoFiltro === 'Todos' || res.estado === estadoFiltro);
  });

  // ── Handlers ──
  const abrirEditar = (r) => { setFormEditar({ ...r }); setModalEditar(r); };

  const guardarEdicion = () => {
    setReservations(prev => prev.map(r => r.id === formEditar.id ? { ...formEditar } : r));
    setModalEditar(null);
    triggerToast('Reserva actualizada correctamente');
  };

  const confirmarEliminar = () => {
    setReservations(prev => prev.filter(r => r.id !== modalEliminar.id));
    setModalEliminar(null);
    triggerToast('Reserva eliminada');
  };

  // ── Helpers de badge ──
  const estadoBadgeClass = (estado) => `badge-status ${estado?.toLowerCase() || 'confirmada'}`;
  const pagoBadgeClass   = (pago)   => `badge-pago ${pago?.toLowerCase() === 'pagado' ? 'pagado' : 'pendiente'}`;

  // ── Formato legible de fecha ISO para los modales ──
  const formatFecha = (str) => {
    if (!str) return '';
    if (str.includes('-')) {
      const [y, m, d] = str.split('-');
      return `${d}/${m}/${y}`;
    }
    return str;
  };

  return (
    <div className="reservas-view-container">

      {/* ── HEADER ── */}
      <header className="reservas-header">
        <div className="header-left">
          <h1>Gestión de Reservas</h1>
          <p className="subtitle">Administrá todas las reservas del sistema</p>
        </div>
      </header>

      {/* ── MÉTRICAS ── */}
      <div className="reservas-metrics-grid">
        <MetricCard label="Confirmada" value={cantConfirmadas} variant="green" />
        <MetricCard label="Cancelada"  value={cantCanceladas}  variant="orange" />
        <MetricCard label="Completada" value={cantCompletadas} variant="blue" />
      </div>

      {/* ── BARRA DE HERRAMIENTAS ── */}
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
          <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="select-filter">
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

      {/* ── TABLA ── */}
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
                      <strong className="date-day">{formatFecha(res.fecha)}</strong>
                      <span className="date-hours">{res.hora}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="pax-tag">
                      <i className="fa-solid fa-user-group icon-pax"></i> {res.personas}
                    </span>
                  </td>
                  <td>
                    <span className={estadoBadgeClass(res.estado)}>
                      <span className="status-indicator-dot"></span> {res.estado}
                    </span>
                  </td>
                  <td>
                    <span className={pagoBadgeClass(res.pago)}>
                      <i className="fa-solid fa-wallet icon-wallet"></i> {res.pago}
                    </span>
                  </td>
                  <td>
                    <span className="channel-tag">{res.canal}</span>
                  </td>
                  <td className="text-center">
                    <div className="actions-cell">
                      <button className="btn-action view"   title="Ver detalle" onClick={() => setModalVer(res)}>
                        <i className="fa-solid fa-eye"></i>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="btn-action edit"   title="Editar"      onClick={() => abrirEditar(res)}>
                        <i className="fa-solid fa-pen"></i>
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button className="btn-action delete" title="Eliminar"    onClick={() => setModalEliminar(res)}>
                        <i className="fa-solid fa-trash"></i>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
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

      {/* ── MATRIZ OPERATIVA ── */}
      <section className="matriz-operativa-section">
        <div className="matriz-header-row">
          <h2>Matriz Operativa del Día</h2>
          <DateSelector />
        </div>
        <DispoGrid fechasCoinciden={fechasCoinciden} />
      </section>

      {/* ════════ MODAL VER ════════ */}
      {modalVer && (
        <div className="rv-modal-overlay" onClick={() => setModalVer(null)}>
          <div className="rv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rv-modal-header">
              <h2>Detalle de Reserva</h2>
              <button className="rv-modal-close" onClick={() => setModalVer(null)}>✕</button>
            </div>
            <div className="rv-modal-body">
              <div className="rv-info-grid">
                <div className="rv-info-block rv-info-block--full">
                  <span className="rv-info-label">Cliente</span>
                  <span className="rv-info-value rv-info-value--lg">{modalVer.cliente}</span>
                  <span className="rv-info-sub">{modalVer.telefono || '+54 11 0000-0000'}</span>
                </div>
                <div className="rv-info-block">
                  <span className="rv-info-label">ID Reserva</span>
                  <span className="rv-info-value rv-info-value--mono">{modalVer.id}</span>
                </div>
                <div className="rv-info-block">
                  <span className="rv-info-label">Sala</span>
                  <span className="rv-info-value">{modalVer.sala}</span>
                </div>
                <div className="rv-info-block">
                  <span className="rv-info-label">Fecha</span>
                  <span className="rv-info-value">{formatFecha(modalVer.fecha)}</span>
                </div>
                <div className="rv-info-block">
                  <span className="rv-info-label">Hora</span>
                  <span className="rv-info-value">{modalVer.hora}</span>
                </div>
                <div className="rv-info-block">
                  <span className="rv-info-label">Personas</span>
                  <span className="rv-info-value">{modalVer.personas}</span>
                </div>
                <div className="rv-info-block">
                  <span className="rv-info-label">Canal</span>
                  <span className="rv-info-value">{modalVer.canal}</span>
                </div>
                <div className="rv-info-block">
                  <span className="rv-info-label">Estado</span>
                  <span className={estadoBadgeClass(modalVer.estado)}>
                    <span className="status-indicator-dot"></span> {modalVer.estado}
                  </span>
                </div>
                <div className="rv-info-block">
                  <span className="rv-info-label">Pago</span>
                  <span className={pagoBadgeClass(modalVer.pago)}>
                    <i className="fa-solid fa-wallet icon-wallet"></i> {modalVer.pago}
                  </span>
                </div>
              </div>
            </div>
            <div className="rv-modal-footer">
              <button className="rv-btn-secondary" onClick={() => setModalVer(null)}>Cerrar</button>
              <button className="rv-btn-primary" onClick={() => { setModalVer(null); abrirEditar(modalVer); }}>
                <i className="fa-solid fa-pen"></i> Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ MODAL EDITAR ════════ */}
      {modalEditar && (
        <div className="rv-modal-overlay" onClick={() => setModalEditar(null)}>
          <div className="rv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rv-modal-header">
              <h2>Editar Reserva <span className="rv-modal-id">{modalEditar.id}</span></h2>
              <button className="rv-modal-close" onClick={() => setModalEditar(null)}>✕</button>
            </div>
            <div className="rv-modal-body">
              <div className="rv-form-grid">
                <div className="rv-form-field rv-form-field--full">
                  <label className="rv-form-label">Cliente</label>
                  <input className="rv-form-input" value={formEditar.cliente}
                    onChange={(e) => setFormEditar({ ...formEditar, cliente: e.target.value })} />
                </div>
                <div className="rv-form-field">
                  <label className="rv-form-label">Teléfono</label>
                  <input className="rv-form-input" value={formEditar.telefono || ''}
                    onChange={(e) => setFormEditar({ ...formEditar, telefono: e.target.value })} />
                </div>
                <div className="rv-form-field">
                  <label className="rv-form-label">Sala</label>
                  <input className="rv-form-input" value={formEditar.sala}
                    onChange={(e) => setFormEditar({ ...formEditar, sala: e.target.value })} />
                </div>
                <div className="rv-form-field">
                  <label className="rv-form-label">Fecha</label>
                  {/* input type=date trabaja siempre en formato ISO AAAA-MM-DD */}
                  <input type="date" className="rv-form-input" value={formEditar.fecha}
                    onChange={(e) => setFormEditar({ ...formEditar, fecha: e.target.value })} />
                </div>
                <div className="rv-form-field">
                  <label className="rv-form-label">Hora</label>
                  <input type="time" className="rv-form-input" value={formEditar.hora}
                    onChange={(e) => setFormEditar({ ...formEditar, hora: e.target.value })} />
                </div>
                <div className="rv-form-field">
                  <label className="rv-form-label">Personas</label>
                  <input type="number" className="rv-form-input" value={formEditar.personas}
                    onChange={(e) => setFormEditar({ ...formEditar, personas: Number(e.target.value) })} />
                </div>
                <div className="rv-form-field">
                  <label className="rv-form-label">Canal</label>
                  <select className="rv-form-input" value={formEditar.canal}
                    onChange={(e) => setFormEditar({ ...formEditar, canal: e.target.value })}>
                    <option>Web</option>
                    <option>WhatsApp</option>
                    <option>Telefónico</option>
                    <option>Presencial</option>
                  </select>
                </div>
                <div className="rv-form-field">
                  <label className="rv-form-label">Estado</label>
                  <select className="rv-form-input" value={formEditar.estado}
                    onChange={(e) => setFormEditar({ ...formEditar, estado: e.target.value })}>
                    <option>Confirmada</option>
                    <option>Completada</option>
                    <option>Cancelada</option>
                  </select>
                </div>
                <div className="rv-form-field">
                  <label className="rv-form-label">Pago</label>
                  <select className="rv-form-input" value={formEditar.pago}
                    onChange={(e) => setFormEditar({ ...formEditar, pago: e.target.value })}>
                    <option>Pagado</option>
                    <option>No Pagado</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="rv-modal-footer">
              <button className="rv-btn-secondary" onClick={() => setModalEditar(null)}>Cancelar</button>
              <button className="rv-btn-primary" onClick={guardarEdicion}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ MODAL ELIMINAR ════════ */}
      {modalEliminar && (
        <div className="rv-modal-overlay" onClick={() => setModalEliminar(null)}>
          <div className="rv-modal rv-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="rv-modal-header rv-modal-header--danger">
              <h2>Eliminar Reserva</h2>
              <button className="rv-modal-close" onClick={() => setModalEliminar(null)}>✕</button>
            </div>
            <div className="rv-modal-body">
              <div className="rv-eliminar-preview">
                <div className="rv-eliminar-icon">🗑</div>
                <p className="rv-eliminar-text">
                  Estás por eliminar la reserva <strong>{modalEliminar.id}</strong> de{' '}
                  <strong>{modalEliminar.cliente}</strong> para el {formatFecha(modalEliminar.fecha)} a las {modalEliminar.hora}.
                </p>
                <p className="rv-eliminar-warn">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <div className="rv-modal-footer">
              <button className="rv-btn-secondary" onClick={() => setModalEliminar(null)}>Cancelar</button>
              <button className="rv-btn-danger" onClick={confirmarEliminar}>
                <i className="fa-solid fa-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}