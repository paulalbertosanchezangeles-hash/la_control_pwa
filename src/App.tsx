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
  total: number;
  anticipo: number;
  estado: 'INGRESADO' | 'DIAGNÓSTICO' | 'REPARACIÓN' | 'LISTO' | 'ENTREGADO';
}

export default function App() {
  const [view, setView] = useState<'client' | 'login' | 'admin'>('client');
  const [userRole, setUserRole] = useState<'admin' | 'worker' | null>(null);
  const [userEmail, setUserEmail] = useState('');

  // Formulario de Login
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Órdenes iniciales de ejemplo
  const [orders, setOrders] = useState<Orden[]>([
    {
      id: '1',
      folio: 'LA-1001',
      fecha: '2026-08-04',
      cliente: 'Juan Pérez',
      telefono: '525512345678',
      moto: 'KTM Duke 390',
      placa: 'ABC12',
      falla: 'Servicio general y ajuste de cadena',
      total: 1250,
      anticipo: 500,
      estado: 'REPARACIÓN'
    }
  ]);

  const [searchPlaca, setSearchPlaca] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null);

  // Formulario Nueva Orden
  const [cliente, setCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [moto, setMoto] = useState('');
  const [placa, setPlaca] = useState('');
  const [falla, setFalla] = useState('');
  const [total, setTotal] = useState('');
  const [anticipo, setAnticipo] = useState('');

  // Iniciar Sesión (Login)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      return alert('Por favor ingresa tu correo y contraseña.');
    }

    const emailClean = emailInput.toLowerCase().trim();

    if (
      emailClean === 'paulalbertosanchezangeles@gmail.com' ||
      emailClean.includes('dueno') || 
      emailClean.includes('admin')
    ) {
      setUserRole('admin');
    } else {
      setUserRole('worker');
    }

    setUserEmail(emailInput);
    setView('admin');
    setEmailInput('');
    setPasswordInput('');
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserEmail('');
    setView('client');
  };

  // Buscar por Placa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.placa.toLowerCase() === searchPlaca.toLowerCase().trim());
    if (found) {
      setSelectedOrder(found);
    } else {
      alert('No se encontró ninguna orden registrada con esa placa.');
      setSelectedOrder(null);
    }
  };

  // Crear Orden (Permitido para todos los registrados)
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || !moto) {
      return alert('Escribe al menos el Nombre del Cliente y el Modelo de Moto.');
    }

    const nuevaOrden: Orden = {
      id: Date.now().toString(),
      folio: `LA-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: new Date().toISOString().split('T')[0],
      cliente,
      telefono: telefono.replace(/[^0-9]/g, ''),
      moto,
      placa: placa.toUpperCase() || 'SIN-PLACA',
      falla: falla || 'Mantenimiento técnico',
      total: Number(total) || 0,
      anticipo: Number(anticipo) || 0,
      estado: 'INGRESADO'
    };

    setOrders([nuevaOrden, ...orders]);
    setCliente('');
    setTelefono('');
    setMoto('');
    setPlaca('');
    setFalla('');
    setTotal('');
    setAnticipo('');
    alert('¡Orden registrada exitosamente!');
  };

  // Cambiar Estatus
  const cambiarEstado = (id: string, nuevoEstado: Orden['estado']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, estado: nuevoEstado } : o));
  };

  // Enviar WhatsApp
  const enviarWhatsApp = (orden: Orden) => {
    const restante = orden.total - orden.anticipo;
    const mensaje = `Hola *${orden.cliente}*, te saludamos de *L.A CONTROL*. 🛠️%0A%0AEl estado actual de tu moto (*${orden.moto}* - Placa: *${orden.placa}*) es: *${orden.estado}*.%0A%0A💰 *Presupuesto:*%0A- Total: $${orden.total}%0A- Anticipo: $${orden.anticipo}%0A- Restante: *$${restante}*%0A%0A¡Quedamos a tus órdenes!`;
    window.open(`https://wa.me/${orden.telefono}?text=${mensaje}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', paddingBottom: '2rem' }}>
      {/* HEADER */}
      <header style={{ padding: '1rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#f59e0b' }}>🛠️ L.A CONTROL</h1>
        
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => setView('client')} 
            style={{ padding: '0.4rem 0.8rem', borderRadius: '0.375rem', border: 'none', background: view === 'client' ? '#f59e0b' : '#1e293b', color: view === 'client' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Consulta
          </button>

          {userRole ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                onClick={() => setView('admin')} 
                style={{ padding: '0.4rem 0.8rem', borderRadius: '0.375rem', border: 'none', background: view === 'admin' ? '#f59e0b' : '#1e293b', color: view === 'admin' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Taller
              </button>
              <button 
                onClick={handleLogout} 
                style={{ padding: '0.4rem 0.6rem', borderRadius: '0.375rem', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Salir
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setView('login')} 
              style={{ padding: '0.4rem 0.8rem', borderRadius: '0.375rem', border: 'none', background: view === 'login' ? '#f59e0b' : '#1e293b', color: view === 'login' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Ingresar
            </button>
          )}
        </nav>
      </header>

      <main style={{ padding: '1rem', maxWidth: '650px', margin: '0 auto' }}>

        {/* VISTA 1: CONSULTA CLIENTE */}
        {view === 'client' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem', background: '#1e293b', borderRadius: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Consulta el Estado de tu Moto</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Ingresa tu número de placa para verificar el avance</p>
              
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                  type="text"
                  placeholder="Ej. ABC12"
                  value={searchPlaca}
                  onChange={(e) => setSearchPlaca(e.target.value)}
                  style={inputStyle}
                />
                <button type="submit" style={{ padding: '0.75rem 1.25rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Buscar
                </button>
              </form>
            </div>

            {selectedOrder && (
              <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '5px solid #f59e0b' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b' }}>Folio: {selectedOrder.folio}</h3>
                <p style={{ margin: '0.25rem 0' }}><strong>Moto:</strong> {selectedOrder.moto} ({selectedOrder.placa})</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Trabajo:</strong> {selectedOrder.falla}</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}><strong>Estado:</strong> <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{selectedOrder.estado}</span></p>
                <hr style={{ borderColor: '#334155', margin: '0.75rem 0' }} />
                <p style={{ margin: '0.25rem 0' }}>Total: ${selectedOrder.total}</p>
                <p style={{ margin: '0.25rem 0', color: '#f59e0b' }}><strong>Restante a Pagar: ${selectedOrder.total - selectedOrder.anticipo}</strong></p>
              </div>
            )}
          </div>
        )}

        {/* VISTA 2: LOGIN */}
        {view === 'login' && (
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '2rem' }}>
            <h2 style={{ textAlign: 'center', margin: '0 0 1rem 0', color: '#f59e0b' }}>Acceso al Personal</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Correo Electrónico</label>
                <input 
                  type="email" 
                  placeholder="ejemplo@lacontrol.com" 
                  value={emailInput} 
                  onChange={(e) => setEmailInput(e.target.value)} 
                  style={{ ...inputStyle, marginTop: '0.25rem' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Contraseña</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                  style={{ ...inputStyle, marginTop: '0.25rem' }} 
                />
              </div>
              <button type="submit" style={{ padding: '0.75rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
                Iniciar Sesión
              </button>
            </form>
          </div>
        )}

        {/* VISTA 3: PANEL DEL TALLER (EQUIPO COMPLETO) */}
        {view === 'admin' && userRole && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#334155', padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Usuario: <strong>{userEmail}</strong></span>
              <span style={{ fontSize: '0.75rem', background: userRole === 'admin' ? '#f59e0b' : '#3b82f6', color: '#000', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 'bold' }}>
                {userRole === 'admin' ? 'DUEÑO / ADMIN' : 'EQUIPO TALLER'}
              </span>
            </div>

            {/* FORMULARIO HABILITADO PARA TODO EL EQUIPO */}
            <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '0.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#f59e0b' }}>➕ Nueva Orden de Trabajo</h3>
              <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input type="text" placeholder="Nombre del Cliente *" value={cliente} onChange={(e) => setCliente(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Teléfono WhatsApp (10 dígitos)" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={inputStyle} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="Moto (Modelo) *" value={moto} onChange={(e) => setMoto(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                  <input type="text" placeholder="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                </div>
                <textarea placeholder="Falla reportada / Diagnóstico" value={falla} onChange={(e) => setFalla(e.target.value)} rows={2} style={inputStyle} />
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="number" placeholder="Presupuesto Total ($)" value={total} onChange={(e) => setTotal(e.target.value)} style={inputStyle} />
                  <input type="number" placeholder="Anticipo Recibido ($)" value={anticipo} onChange={(e) => setAnticipo(e.target.value)} style={inputStyle} />
                </div>

                <button type="submit" style={{ padding: '0.75rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Guardar Orden
                </button>
              </form>
            </div>

            {/* LISTA DE ÓRDENES */}
            <div>
              <h3>📋 Órdenes en Taller ({orders.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
                {orders.map(o => (
                  <div key={o.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong>{o.folio} - {o.moto}</strong>
                      <span style={{ fontSize: '0.75rem', background: '#334155', color: '#f59e0b', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontWeight: 'bold' }}>
                        {o.estado}
                      </span>
                    </div>

                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>👤 <strong>Cliente:</strong> {o.cliente} {o.telefono ? `(${o.telefono})` : ''}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>🏷️ <strong>Placa:</strong> {o.placa}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#cbd5e1' }}>🛠️ <strong>Detalle:</strong> {o.falla}</p>
                    
                    <p style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '0.85rem' }}>💵 Total: ${o.total} | Anticipo: ${o.anticipo} | <strong style={{ color: '#22c55e' }}>Restante: ${o.total - o.anticipo}</strong></p>

                    {/* Botón WhatsApp habilitado para todo el personal */}
                    {o.telefono && (
                      <button 
                        onClick={() => enviarWhatsApp(o)} 
                        style={{ margin: '0.5rem 0', width: '100%', padding: '0.4rem', background: '#25D366', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        📲 Notificar por WhatsApp
                      </button>
                    )}

                    {/* Control de Estatus */}
                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {(['INGRESADO', 'DIAGNÓSTICO', 'REPARACIÓN', 'LISTO', 'ENTREGADO'] as Orden['estado'][]).map((st) => (
                        <button
                          key={st}
                          onClick={() => cambiarEstado(o.id, st)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.7rem',
                            border: 'none',
                            borderRadius: '0.25rem',
                            background: o.estado === st ? '#f59e0b' : '#334155',
                            color: o.estado === st ? '#000' : '#fff',
                            cursor: 'pointer',
                            fontWeight: o.estado === st ? 'bold' : 'normal'
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
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

const inputStyle = {
  padding: '0.6rem',
  borderRadius: '0.375rem',
  border: '1px solid #475569',
  background: '#0f172a',
  color: '#fff',
  fontSize: '0.9rem',
  width: '100%',
  boxSizing: 'border-box' as const
};
