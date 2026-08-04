import React, { useState } from 'react';

interface Orden {
  id: string;
  folio: string;
  fecha: string;
  cliente: string;
  telefono: string;
  moto: string;
  placa: string;
  falla: string;
  estado: string;
}

const ORDENES_INICIALES: Orden[] = [
  {
    id: '1',
    folio: 'LA-1001',
    fecha: '2026-08-04',
    cliente: 'Juan Pérez',
    telefono: '5512345678',
    moto: 'KTM Duke 390',
    placa: 'ABC12',
    falla: 'Servicio general y cambio de balatas',
    estado: 'EN REVISIÓN'
  }
];

export default function App() {
  const [view, setView] = useState<'home' | 'admin'>('home');
  const [orders, setOrders] = useState<Orden[]>(ORDENES_INICIALES);
  const [searchPlaca, setSearchPlaca] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null);

  // Formulario
  const [cliente, setCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [moto, setMoto] = useState('');
  const [placa, setPlaca] = useState('');
  const [falla, setFalla] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.placa.toLowerCase() === searchPlaca.toLowerCase().trim());
    if (found) {
      setSelectedOrder(found);
    } else {
      alert('No se encontró ninguna orden con esa placa.');
      setSelectedOrder(null);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || !moto) {
      return alert('Escribe al menos el nombre del cliente y el modelo de la moto.');
    }

    const nuevaOrden: Orden = {
      id: Date.now().toString(),
      folio: `LA-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: new Date().toISOString().split('T')[0],
      cliente,
      telefono,
      moto,
      placa: placa || 'SIN-PLACA',
      falla: falla || 'Mantenimiento general',
      estado: 'EN REVISIÓN'
    };

    setOrders([nuevaOrden, ...orders]);
    setCliente('');
    setTelefono('');
    setMoto('');
    setPlaca('');
    setFalla('');
    alert('¡Orden de trabajo creada con éxito!');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', paddingBottom: '2rem' }}>
      {/* Header */}
      <header style={{ padding: '1rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#f59e0b' }}>🛠️ L.A CONTROL</h1>
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setView('home')} 
            style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', background: view === 'home' ? '#f59e0b' : '#1e293b', color: view === 'home' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Inicio
          </button>
          <button 
            onClick={() => setView('admin')} 
            style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', background: view === 'admin' ? '#f59e0b' : '#1e293b', color: view === 'admin' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Taller
          </button>
        </nav>
      </header>

      <main style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
        {/* VISTA CLIENTE / INICIO */}
        {view === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem', background: '#1e293b', borderRadius: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Consulta el Estado de tu Moto</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Ingresa tu placa para conocer el avance en tiempo real</p>
              
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                  type="text"
                  placeholder="Ej. ABC12"
                  value={searchPlaca}
                  onChange={(e) => setSearchPlaca(e.target.value)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <button type="submit" style={{ padding: '0.75rem 1.25rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Buscar
                </button>
              </form>
            </div>

            {selectedOrder && (
              <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Folio: {selectedOrder.folio}</h3>
                <p style={{ margin: '0.25rem 0' }}><strong>Cliente:</strong> {selectedOrder.cliente}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Moto:</strong> {selectedOrder.moto} ({selectedOrder.placa})</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Trabajo:</strong> {selectedOrder.falla}</p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#f59e0b', fontWeight: 'bold' }}>Estado: {selectedOrder.estado}</p>
              </div>
            )}
          </div>
        )}

        {/* VISTA TALLER / ADMIN */}
        {view === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#f59e0b' }}>📋 Nueva Orden de Trabajo</h3>
              <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Nombre del cliente *"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <input
                  type="text"
                  placeholder="Modelo de Moto *"
                  value={moto}
                  onChange={(e) => setMoto(e.target.value)}
                  style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <input
                  type="text"
                  placeholder="Placa / VIN"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <textarea
                  placeholder="Falla reportada / Servicios requeridos"
                  value={falla}
                  onChange={(e) => setFalla(e.target.value)}
                  rows={3}
                  style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <button type="submit" style={{ padding: '0.75rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  ➕ Guardar Orden
                </button>
              </form>
            </div>

            {/* LISTA DE ÓRDENES */}
            <div>
              <h3>📋 Órdenes Registradas ({orders.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {orders.map(o => (
                  <div key={o.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>{o.folio} - {o.moto}</strong>
                      <span style={{ fontSize: '0.75rem', background: '#334155', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', color: '#f59e0b', fontWeight: 'bold' }}>{o.estado}</span>
                    </div>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}><strong>Cliente:</strong> {o.cliente} {o.telefono ? `(${o.telefono})` : ''}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}><strong>Placa:</strong> {o.placa}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#cbd5e1' }}><strong>Detalle:</strong> {o.falla}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
