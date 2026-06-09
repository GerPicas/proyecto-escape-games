import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import MetricCard from '../../components/MetricCard/MetricCard';
import './Facturacion.css';

export default function Facturacion() {
  const { reservations = [] } = useContext(AppContext);
  const [filtroPago, setFiltroPago] = useState('Todos');
  const [facturadosIds, setFacturadosIds] = useState([]);

  // ---- CÁLCULO DE MÉTRICAS FINANCIERAS EN TIEMPO REAL ----
  // Asumimos valores por defecto si no vienen cargados en el JSON original
  const ingresosTotales = reservations.reduce((acc, res) => acc + (Number(res.montoTotal) || 12000), 0);
  
  const totalCobrado = reservations.reduce((acc, res) => {
    const sena = Number(res.montoSena) || 4000;
    const esSaldado = res.pago?.toLowerCase() === 'pagado';
    const total = Number(res.montoTotal) || 12000;
    return acc + (esSaldado ? total : sena);
  }, 0);

  const porCobrar = ingresosTotales - totalCobrado;

  // ---- FILTRADO PARA LA TABLA DE CONTROL ----
  const registrosFiltrados = reservations.filter(res => {
    if (filtroPago === 'Todos') return true;
    if (filtroPago === 'Pagado') return res.pago?.toLowerCase() === 'pagado';
    return res.pago?.toLowerCase() === 'pendiente';
  });

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
          value={`$${totalCobrado.toLocaleString('es-AR')}`} 
        />
        <MetricCard 
          label="PENDIENTE FACTURAR" 
          value={`$${porCobrar.toLocaleString('es-AR')}`} 
        />
        <MetricCard 
          label="NO APLICA" 
          value="$12.000" 
        />
        <MetricCard 
          label="EFECTIVO (NO FACTURABLE)" 
          value="$21.300" 
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
                const total = Number(res.montoTotal) || 12000;
                const sena = Number(res.montoSena) || 4000;
              
                // EVALUACIÓN: Está saldado si viene de la data (pagado/facturado) O si se clickeó recién (está en el estado local)
                const esSaldado = res.pago?.toLowerCase() === 'pagado' || res.facturado || facturadosIds.includes(res.id);
                const montoAMostrar = esSaldado ? total : sena;
                const conceptoDesc = esSaldado ? `Total reserva ${res.id || ''}` : `Seña reserva ${res.id || ''}`;
              
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
                      <span className={`badge-estado ${esSaldado ? 'facturado' : 'pendiente'}`}>
                        {esSaldado ? 'Facturado' : 'Pendiente de facturar'}
                      </span>
                    </td>
                    <td className="text-right">
                      {/* Al hacer click se mete el ID en el estado, mutando la fila al instante */}
                      {!esSaldado ? (
                        <button 
                          className="btn-marcar-facturado" 
                          onClick={() => setFacturadosIds(prev => [...prev, res.id])}
                        >
                          <i className="fa-solid fa-check"></i> Marcar facturado
                        </button>
                      ) : (
                        <span className="check-facturado-icon">
                          <i className="fa-solid fa-circle-check"></i>
                        </span>
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
            <input type="text" value={`$${totalCobrado.toLocaleString('es-AR')}`} disabled />
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
