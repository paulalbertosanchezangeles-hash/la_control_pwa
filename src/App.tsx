import React, { useState } from 'react';
import { INITIAL_ORDERS } from './mockData';
import { OrdenTrabajo, EstadoMoto } from './types';
import { Wrench, Search, Phone, Shield, CheckCircle, Clock, FileText, Send, User, Bike, PlusCircle } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'home' | 'admin' | 'client'>('home');
  const [orders, setOrders] = useState<OrdenTrabajo[]>(INITIAL_ORDERS);
  const [searchPlaca, setSearchPlaca] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrdenTrabajo | null>(null);

  // Estado del formulario para nueva orden
  const [newOrder, setNewOrder] = useState({
    clienteNombre: '',
    clienteTelefono: '',
    motoModelo: '',
    motoPlaca: '',
    fallaReportada: ''
  });

  // Estadísticas
  const totalInTaller = orders.filter(o => o.estado !== 'ENTREGADO').length;
  const listos = orders.filter(o => o.estado === 'LISTO').length;
  const pendientes = orders.filter(o => ['INGRESADO', 'DIAGNOSTICO', 'REPUESTOS', 'REPARACION', 'PRUEBAS'].includes(o.estado)).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.moto.placa.toLowerCase() === searchPlaca.toLowerCase().trim());
    if (found) {
      setSelectedOrder(found);
    } else {
      alert('No se encontró ninguna orden con esa placa.');
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.clienteNombre || !newOrder.motoModelo) {
      return alert('Por favor ingresa al menos el nombre del cliente y el modelo de la moto.');
    }

    const created: OrdenTrabajo = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      folio: `LA-${Math.floor(1000 + Math.random() * 9000)}`,
      fechaIngreso: new Date().toISOString().split('T')[0],
      cliente: {
        nombre: newOrder.clienteNombre,
        telefono: newOrder.clienteTelefono,
      },
      moto: {
        modelo: newOrder.motoModelo,
        placa: newOrder.motoPlaca || 'SIN-PLACA',
      },
      estado: 'INGRESADO',
      trabajosRealizados: [newOrder.fallaReportada || 'Revisión general'],
      presupuestoTotal: 0,
      anticipo: 0
    };

    setOrders([created, ...orders]);
    setNewOrder({ clienteNombre: '', clienteTelefono: '', motoModelo: '', motoPlaca: '', fallaReportada: '' });
    alert('¡Orden de trabajo creada con éxito!');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ padding: '1rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wrench style={{ color: '#f59e0b' }} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>L.A CONTROL</h1>
        </div>
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setView('home')} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', background: view === 'home' ? '#f59e0b' : '#1e293b', color: '#fff', cursor: 'pointer' }}>Inicio</button>
          <button onClick={() => setView('admin')} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', background: view === 'admin' ? '#f59e0b' : '#1e293b', color: '#fff', cursor: 'pointer' }}>Taller</button>
        </nav>
      </header>

      <main style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        {view === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#1e293b', borderRadius: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Consulta el Estado de tu Moto</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Ingresa tu placa para conocer el avance en tiempo real</p>
              
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                  type="text"
                  placeholder="Ej. ABC1234"
                  value={searchPlaca}
                  onChange={(e) => setSearchPlaca(e.target.value)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Buscar
                </button>
              </form>
            </div>

            {selectedOrder && (
              <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
                <h3>Orden: {selectedOrder.folio}</h3>
                <p><strong>Cliente:</strong> {selectedOrder.cliente.nombre}</p>
                <p><strong>Moto:</strong> {selectedOrder.moto.modelo} ({selectedOrder.moto.placa})</p>
                <p><strong>Estado:</strong> <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{selectedOrder.estado}</span></p>
              </div>
            )}
          </div>
        )}

        {view === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Panel de métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalInTaller}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>En Taller</div>
              </div>
              <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#eab308' }}>{pendientes}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>En Proceso</div>
              </div>
              <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{listos}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Listos</div>
              </div>
            </div>

            {/* Formulario Nueva Orden */}
            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0' }}>
                <PlusCircle style={{ color: '#f59e0b' }} /> Nueva Orden de Trabajo
              </h3>
              <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={newOrder.clienteNombre}
                  onChange={(e) => setNewOrder({ ...newOrder, clienteNombre: e.target.value })}
                  style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={newOrder.clienteTelefono}
                  onChange={(e) => setNewOrder({ ...newOrder, clienteTelefono: e.target.value })}
                  style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <input
                  type="text"
                  placeholder="Modelo de Moto"
                  value={newOrder.motoModelo}
                  onChange={(e) => setNewOrder({ ...newOrder, motoModelo: e.target.value })}
                  style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <input
                  type="text"
                  placeholder="Placa / VIN"
                  value={newOrder.motoPlaca}
                  onChange={(e) => setNewOrder({ ...newOrder, motoPlaca: e.target.value })}
                  style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <textarea
                  placeholder="Falla reportada / Servicios"
                  value={newOrder.fallaReportada}
                  onChange={(e) => setNewOrder({ ...newOrder, fallaReportada: e.target.value })}
                  rows={2}
                  style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
                />
                <button type="submit" style={{ padding: '0.75rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Guardar Orden
                </button>
              </form>
            </div>

            {/* Lista de Órdenes */}
            <h3>Órdenes en Sistema</h3>
            {orders.map(o => (
              <div key={o.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{o.folio} - {o.moto.modelo}</strong>
                  <span style={{ fontSize: '0.875rem', background: '#334155', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>{o.estado}</span>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>Cliente: {o.cliente.nombre} ({o.cliente.telefono})</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
