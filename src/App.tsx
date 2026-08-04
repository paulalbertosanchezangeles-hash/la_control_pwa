import React, { useState } from 'react';

export default function App() {
  const [ordenes, setOrdenes] = useState([]);
  const [formData, setFormData] = useState({
    cliente: '',
    telefono: '',
    moto: '',
    placa: '',
    falla: '',
    estado: 'En revisión'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cliente || !formData.moto) return alert('Por favor llena los datos principales');
    
    const nuevaOrden = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      ...formData
    };

    setOrdenes([nuevaOrden, ...ordenes]);
    setFormData({ cliente: '', telefono: '', moto: '', placa: '', falla: '', estado: 'En revisión' });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h2>📋 Nueva Orden de Trabajo</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="cliente" placeholder="Nombre del cliente" value={formData.cliente} onChange={handleChange} required style={inputStyle} />
        <input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} style={inputStyle} />
        <input name="moto" placeholder="Modelo de Moto (ej. Benelli 302)" value={formData.moto} onChange={handleChange} required style={inputStyle} />
        <input name="placa" placeholder="Placa / VIN" value={formData.placa} onChange={handleChange} style={inputStyle} />
        <textarea name="falla" placeholder="Falla reportada / Trabajo a realizar" value={formData.falla} onChange={handleChange} rows="3" style={inputStyle} />
        
        <button type="submit" style={btnStyle}>➕ Crear Orden de Trabajo</button>
      </form>

      <hr style={{ margin: '30px 0' }} />

      <h3>🛠️ Órdenes Registradas ({ordenes.length})</h3>
      {ordenes.length === 0 ? (
        <p style={{ color: '#666' }}>No hay órdenes registradas aún.</p>
      ) : (
        ordenes.map(orden => (
          <div key={orden.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>{orden.moto} ({orden.placa || 'Sin placa'})</span>
              <span style={{ color: '#0070f3' }}>{orden.estado}</span>
            </div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Cliente:</strong> {orden.cliente} | 📞 {orden.telefono}</p>
            <p style={{ margin: '5px 0', fontSize: '14px', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
              <strong>Detalle:</strong> {orden.falla}
            </p>
            <small style={{ color: '#888' }}>Fecha: {orden.fecha}</small>
          </div>
        ))
      )}
    </div>
  );
}

const inputStyle = { padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' };
const btnStyle = { padding: '12px', fontSize: '16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const cardStyle = { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
