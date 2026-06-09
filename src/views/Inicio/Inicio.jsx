import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext'; // Import correcto con llaves
import MetricCard from '../../components/MetricCard/MetricCard';
import Calendario from './components/Calendario/Calendario';
import './Inicio.css'; // Mantenemos tus estilos originales de la vista
import InfraStatus from './components/InfraStatus/InfraStatus';

export default function Inicio() {
  // 1. Extraemos las reservas reales directamente del Contexto
  const { reservations } = useContext(AppContext);

  // Variables de control estables para que tus componentes hijos no tiren un ReferenceError
  const fechaAuditoria = "2026-06-08";
  const setFechaAuditoria = () => {};

  // ---- FILTROS OPERATIVOS MENSUALES (DESDE HOY HASTA FIN DE MES) ----
  const hoyObjeto = new Date();
  const añoActual = hoyObjeto.getFullYear();
  const mesActual = hoyObjeto.getMonth() + 1;
  const diaActual = hoyObjeto.getDate();

  const mesFormateado = String(mesActual).padStart(2, '0');
  const stringHoy = `${añoActual}-${mesFormateado}-${String(diaActual).padStart(2, '0')}`;
  const ultimoDiaMes = new Date(añoActual, mesActual, 0).getDate();
  const stringFinDeMes = `${añoActual}-${mesFormateado}-${String(ultimoDiaMes).padStart(2, '0')}`;

  // Filtrado limpio de tu array por rango alfabético/cronológico de strings
  const turnosDelMes = reservations.filter(res => {
    if (!res.fecha) return false;
    return res.fecha >= stringHoy && res.fecha <= stringFinDeMes;
  });

  // Mapeamos los resultados a tus variables originales exactas
  const totalHoy = turnosDelMes.length;
  const confirmadosHoy = turnosDelMes.filter(res => res.estado === 'Confirmada').length;
  const pendientesHoy = turnosDelMes.filter(res => res.pago === 'No Pagado' && res.estado !== 'Cancelada').length;

  return (
    <div className="inicio-container">
      {/* HEADER ORIGINAL RESTAURADO */}
      <div className="inicio-header">
        <h1>Control de Operaciones</h1>
        <p className="fecha-sistema">
          Previsión: {hoyObjeto.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
        </p>
        <span className="sesion-activa">
          Sesión activa: <strong>Recepción Local</strong> (RECEPCIONISTA)
        </span>
      </div>

{/* GRILLA CON LAS PROPS REALES DEL COMPONENTE: label Y variant */}
      <div className="operaciones-grid">
        <MetricCard 
          label="TURNOS FUTUROS (MES)" 
          value={totalHoy} 
          variant="blue" 
        />
        <MetricCard 
          label="CONFIRMADOS" 
          value={confirmadosHoy} 
          variant="green" 
        />
        <MetricCard 
          label="POR COBRAR / PENDIENTES" 
          value={pendientesHoy} 
          variant="orange" 
        />
      </div>

      {/* SECCIÓN DEL CALENDARIO */}
      <div className="calendar-section">
        <Calendario 
          reservations={reservations} 
          fechaAuditoria={fechaAuditoria} 
          setFechaAuditoria={setFechaAuditoria} 
        />
      </div>

      {/* CONSOLE DE INFRAESTRUCTURA REAL (Tu componente con selectores Web/WhatsApp) */}
      <div className="infra-section-wrapper">
        <InfraStatus />
      </div>
    </div>
  );
}