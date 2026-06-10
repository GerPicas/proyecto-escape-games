import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import MetricCard from '../../components/MetricCard/MetricCard';
import './Facturacion.css';

const MONTO_TOTAL_DEFAULT = 12000;
const MONTO_SENA_DEFAULT = 4000;

const montoTotalReserva = (reserva) => Number(reserva.montoTotal) || MONTO_TOTAL_DEFAULT;
const montoSenaReserva = (reserva) => Number(reserva.montoSena) || MONTO_SENA_DEFAULT;
const estaCancelada = (reserva) => reserva.estado?.toLowerCase() === 'cancelada';
const estaFacturada = (reserva) => reserva.facturado === true || reserva.pago?.toLowerCase() === 'pagado';

export default function Facturacion() {
  const { reservations = [], payments = [], setReservations, triggerToast } = useContext(AppContext);
  const filtroPago = 'Todos';

  // ---- CÁLCULO DE MÉTRICAS FINANCIERAS EN TIEMPO REAL ----
  const facturadoEsteMes = reservations.reduce((acc, res) => {
    if (estaCancelada(res) || !estaFacturada(res)) return acc;
    return acc + montoTotalReserva(res);
  }, 0);

  const pendienteFacturar = reservations.reduce((acc, res) => {
    if (estaCancelada(res) || estaFacturada(res)) return acc;
    return acc + montoTotalReserva(res);
  }, 0);

  const noAplica = reservations.reduce((acc, res) => {
    if (!estaCancelada(res)) return acc;
    return acc + montoTotalReserva(res);
  }, 0);

  const efectivoNoFacturable = payments.reduce((acc, pago) => {
    const esIngresoEfectivo = pago.tipo === 'Ingreso' && pago.metodo === 'Efectivo';
    const estaPagado = pago.estado === 'Pagado';
    return esIngresoEfectivo && estaPagado ? acc + Number(pago.monto || 0) : acc;
  }, 0);

  // ---- FILTRADO PARA LA TABLA DE CONTROL ----
  const registrosFiltrados = reservations.filter(res => {
    if (filtroPago === 'Todos') return true;
    if (filtroPago === 'Pagado') return estaFacturada(res);
    return !estaFacturada(res) && !estaCancelada(res);
  });

  const marcarFacturado = (reservaId) => {
    const hoy = new Date().toISOString().slice(0, 10);

    setReservations((prev) => prev.map((res) => (
      res.id === reservaId
        ? { ...res, facturado: true, fechaFacturacion: hoy }
        : res
    )));

    triggerToast?.('Reserva marcada como facturada');
  };

  return (
    <div className="facturacion-view-container">
      
      <header className="facturacion-header">
        <div className="header-left">
          <h1>Control de Facturación</h1>
          <p className="subtitle">Monitoreá la caja diaria, señas ingresadas y saldos pendientes por sala</p>
        </div>
        <button className="btn-cierre-caja" onClick={() => alert('Cierre de caja exportado al sistema contable.')}>
          <i className="fa-solid fa-vault"></i> Realizar Cierre de Caja
        </button>
      </header>

      {/* SECCIÓN 1: METRICAS FINANCIERAS */}
      <div className="financial-metrics-grid">
        <MetricCard 
          label="FACTURADO ESTE MES" 
          value={`$${facturadoEsteMes.toLocaleString('es-AR')}`} 
        />
        <MetricCard 
          label="PENDIENTE FACTURAR" 
          value={`$${pendienteFacturar.toLocaleString('es-AR')}`} 
        />
        <MetricCard 
          label="NO APLICA" 
          value={`$${noAplica.toLocaleString('es-AR')}`} 
        />
        <MetricCard 
          label="EFECTIVO (NO FACTURABLE)" 
          value={`$${efectivoNoFacturable.toLocaleString('es-AR')}`} 
        />
      </div>

         {/* REEMPLAZO EXCLUSIVO: TABLA DINÁMICA CON ESTADOS DE COLOR Y ACCIÓN REACIVA */}
      <div className="table-container">
        <table className="facturacion-table">
          <thead>
            <tr>
              <th>FECHA</th>
              <th>DESCRIPCIÓN</th>
              <th>MONTO</th>
              <th>CÓMO FACTURAR</th>
              <th>ESTADO</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((res) => {
                const total = montoTotalReserva(res);
                const sena = montoSenaReserva(res);
                const esNoAplica = estaCancelada(res);
                const esSaldado = !esNoAplica && estaFacturada(res);
                const estaPendiente = !esNoAplica && !esSaldado;
                const montoAMostrar = esSaldado || esNoAplica ? total : sena;
                const conceptoDesc = esNoAplica
                  ? `Reserva cancelada ${res.id || ''}`
                  : esSaldado
                    ? `Total reserva ${res.id || ''}`
                    : `Seña reserva ${res.id || ''}`;
                const estadoTexto = esNoAplica ? 'No aplica' : esSaldado ? 'Facturado' : 'Pendiente de facturar';
                const estadoClase = esNoAplica ? 'no-aplica' : esSaldado ? 'facturado' : 'pendiente';
              
                const metodoClase = res.canal?.toLowerCase().includes('web') ? 'web' : 'sucursal';
                const metodoTexto = res.medioPago ? `${res.canal || 'Web'} · ${res.medioPago}` : `${res.canal || 'Web'} · Facturante`;
              
                return (
                  <tr key={res.id}>
                    <td>{res.fecha}</td>
                    <td>{conceptoDesc} - {res.sala} ({res.cliente})</td>
                    <td className="txt-monto">${montoAMostrar.toLocaleString('es-AR')}</td>
                    <td>
                      <span className={`badge-metodo ${metodoClase}`}>{metodoTexto}</span>
                    </td>
                    <td>
                      {/* Cambia dinámicamente el texto y la clase CSS al clickear */}
                      <span className={`badge-estado ${estadoClase}`}>
                        {estadoTexto}
                      </span>
                    </td>
                    <td className="text-right">
                      {estaPendiente ? (
                        <button 
                          className="btn-marcar-facturado" 
                          onClick={() => marcarFacturado(res.id)}
                        >
                          <i className="fa-solid fa-check"></i> Marcar facturado
                        </button>
                      ) : esSaldado ? (
                        <span className="check-facturado-icon">
                          <i className="fa-solid fa-circle-check"></i>
                        </span>
                      ) : (
                        <span className="no-aplica-icon">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center" style={{ color: '#94a3b8', padding: '24px' }}>
                  No hay transacciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
          
      {/* SECCIÓN 3: CONTROL DE FLUJO RAPIDO DE EFECTIVO */}
      <section className="cierre-rapido-section">
        <h2>Control Rápido de Caja Chica</h2>
        <div className="cierre-grid-inputs">
          <div className="input-fin-group">
            <label>Efectivo Inicial (Apertura)</label>
            <input type="text" placeholder="$15.000" disabled />
          </div>
          <div className="input-fin-group">
            <label>Ingresos Declarados en Turno</label>
            <input type="text" value={`$${facturadoEsteMes.toLocaleString('es-AR')}`} disabled />
          </div>
          <div className="input-fin-group">
            <label>Retiros / Gastos de Caja</label>
            <input type="number" placeholder="Ej: $1.200 (Art. Limpieza)" />
          </div>
        </div>
      </section>

    </div>
  );
}
