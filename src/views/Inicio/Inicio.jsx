import { useContext } from 'react';
import { AppContext } from '../../context/AppContext'; // Import correcto con llaves
import MetricCard from '../../components/MetricCard/MetricCard';
import Calendario from './components/Calendario/Calendario';
import './Inicio.css'; // Mantenemos tus estilos originales de la vista
import InfraStatus from './components/InfraStatus/InfraStatus';

const MONTO_TOTAL_DEFAULT = 12000;
const CAPACIDAD_SALA_ESTIMADA = 6;

const chartColors = ['#f97316', '#fb923c', '#94a3b8', '#475569'];

const agruparPor = (items, keyFn, valueFn = () => 1) => items.reduce((acc, item) => {
  const key = keyFn(item) || 'Sin dato';
  acc[key] = (acc[key] || 0) + valueFn(item);
  return acc;
}, {});

const ordenarEntradas = (objeto) => Object.entries(objeto).sort((a, b) => b[1] - a[1]);

const topConOtros = (entradas, limite = 3) => {
  const principales = entradas.slice(0, limite);
  const resto = entradas.slice(limite).reduce((acc, [, value]) => acc + value, 0);
  return resto > 0 ? [...principales, ['Otros', resto]] : principales;
};

const crearDonut = (entradas) => {
  const total = entradas.reduce((acc, [, value]) => acc + value, 0);
  if (!total) return '#e2e8f0';

  let acumulado = 0;
  return entradas.map(([, value], index) => {
    const inicio = acumulado;
    const fin = acumulado + (value / total) * 100;
    acumulado = fin;
    return `${chartColors[index % chartColors.length]} ${inicio}% ${fin}%`;
  }).join(', ');
};

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

  const reservasActivas = reservations.filter(res => res.estado !== 'Cancelada');
  const totalReservasActivas = reservasActivas.length;
  const salasOrdenadas = ordenarEntradas(agruparPor(reservasActivas, res => res.sala));
  const canalesOrdenados = ordenarEntradas(agruparPor(reservasActivas, res => res.canal));
  const horariosOrdenados = Object.entries(agruparPor(reservasActivas, res => res.hora?.slice(0, 2) || 'Sin hora'))
    .sort(([horaA], [horaB]) => horaA.localeCompare(horaB));
  const recaudacionPorSala = ordenarEntradas(agruparPor(
    reservasActivas,
    res => res.sala,
    res => Number(res.montoTotal) || MONTO_TOTAL_DEFAULT
  ));

  const salaMasPopular = salasOrdenadas[0]?.[0] || 'Sin datos';
  const salaMasRecaudada = recaudacionPorSala[0]?.[0] || 'Sin datos';
  const horaPico = horariosOrdenados.reduce((max, item) => item[1] > max[1] ? item : max, ['Sin datos', 0]);
  const ocupacionMedia = totalReservasActivas
    ? Math.round((reservasActivas.reduce((acc, res) => acc + (Number(res.personas) || 0), 0) / (totalReservasActivas * CAPACIDAD_SALA_ESTIMADA)) * 100)
    : 0;

  const salasChart = topConOtros(salasOrdenadas, 3);
  const canalesChart = topConOtros(canalesOrdenados, 3);
  const maxHorario = Math.max(...horariosOrdenados.map(([, value]) => value), 1);
  const totalUsoSalas = salasChart.reduce((acc, [, value]) => acc + value, 0);
  const totalCanales = canalesChart.reduce((acc, [, value]) => acc + value, 0);

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

      <section className="analytics-section">
        <div className="analytics-header">
          <div>
            <h2>Analítica de Reservas</h2>
            <p>Lectura operativa basada en las reservas mockeadas del sistema</p>
          </div>
        </div>

        <div className="analytics-summary-grid">
          <article className="analytics-highlight-card">
            <span>Sala más solicitada</span>
            <strong>{salaMasPopular}</strong>
          </article>
          <article className="analytics-kpi-card">
            <span>Ocupación media</span>
            <strong>{ocupacionMedia}%</strong>
          </article>
          <article className="analytics-kpi-card">
            <span>Horario pico</span>
            <strong>{horaPico[0] !== 'Sin datos' ? `${horaPico[0]}:00` : horaPico[0]}</strong>
          </article>
          <article className="analytics-kpi-card">
            <span>Mayor recaudación</span>
            <strong>{salaMasRecaudada}</strong>
          </article>
        </div>

        <div className="analytics-grid">
          <article className="analytics-card">
            <div className="analytics-card-header">
              <h3>Uso de Salas</h3>
              <span>{totalUsoSalas} reservas</span>
            </div>
            <div className="donut-layout">
              <div
                className="donut-chart"
                style={{ background: `conic-gradient(${crearDonut(salasChart)})` }}
              >
                <div className="donut-center">
                  <strong>{totalUsoSalas}</strong>
                  <span>Total</span>
                </div>
              </div>
              <div className="chart-legend">
                {salasChart.map(([label, value], index) => (
                  <div className="legend-row" key={label}>
                    <span className="legend-label">
                      <i style={{ backgroundColor: chartColors[index % chartColors.length] }}></i>
                      {label}
                    </span>
                    <strong>{Math.round((value / totalUsoSalas) * 100)}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="analytics-card">
            <div className="analytics-card-header">
              <h3>Volumen por Canal</h3>
              <span>{totalCanales} reservas</span>
            </div>
            <div className="donut-layout">
              <div
                className="donut-chart"
                style={{ background: `conic-gradient(${crearDonut(canalesChart)})` }}
              >
                <div className="donut-center">
                  <strong>{totalCanales}</strong>
                  <span>Reservas</span>
                </div>
              </div>
              <div className="chart-legend">
                {canalesChart.map(([label, value], index) => (
                  <div className="legend-row" key={label}>
                    <span className="legend-label">
                      <i style={{ backgroundColor: chartColors[index % chartColors.length] }}></i>
                      {label}
                    </span>
                    <strong>{Math.round((value / totalCanales) * 100)}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="analytics-card analytics-card--wide">
            <div className="analytics-card-header">
              <h3>Horarios pico</h3>
              <span>{horaPico[1]} reservas en el pico</span>
            </div>
            <div className="peak-hours-chart">
              {horariosOrdenados.map(([hora, value]) => (
                <div className="peak-hour-row" key={hora}>
                  <span>{hora}:00</span>
                  <div className="peak-hour-track">
                    <div style={{ width: `${(value / maxHorario) * 100}%` }}></div>
                  </div>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

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
