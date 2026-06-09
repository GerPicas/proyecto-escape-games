import React, { useContext } from 'react';
import { AppContext } from '../../../../context/AppContext';
import './DateSelector.css';

export default function DateSelector() {
  const { fechaAuditoria, setFechaAuditoria } = useContext(AppContext);

  const handleDateChange = (e) => {
    setFechaAuditoria(e.target.value);
  };

  const shiftDate = (days) => {
    // Manejo seguro del string "YYYY-MM-DD" para evitar desfasajes horariós locales
    const [year, month, day] = fechaAuditoria.split('-').map(Number);
    const current = new Date(year, month - 1, day);
    current.setDate(current.getDate() + days);
    
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    
    setFechaAuditoria(`${yyyy}-${mm}-${dd}`);
  };

  const setToday = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    setFechaAuditoria(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className="date-selector-wrapper">
      {/* BOTÓN IZQUIERDO CORREGIDO */}
      <button className="date-nav-btn" onClick={() => shiftDate(-1)} title="Día Anterior">
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      
      <div className="date-input-container">
        <input 
          type="date" 
          value={fechaAuditoria} 
          onChange={handleDateChange} 
          className="audit-date-picker"
        />
      </div>

      {/* BOTÓN DERECHO CORREGIDO */}
      <button className="date-nav-btn" onClick={() => shiftDate(1)} title="Siguiente Día">
        <i className="fa-solid fa-chevron-right"></i>
      </button>
      
      <button className="date-today-btn" onClick={setToday}>
        Hoy
      </button>
    </div>
  );
}