import React, { useState } from 'react';

interface Orden {
  id: string;
  folio: string;
  fecha: string;
  cliente: string;
  telefono: string;
  moto: string;
  placa: string;
  km: number;
  proximoKm: number;
  mecanico: string;
  falla: string;
  refacciones: string;
  total: number;
  anticipo: number;
  estado: 'INGRESADO' | 'DIAGNÓSTICO' | 'REPARACIÓN' | 'LISTO' | 'ENTREGADO';
  fotos: string[];
  archivada?: boolean;
}

interface RefaccionStock {
  id: string;
  nombre: string;
  stock: number;
  precio: number;
}

export default function App() {
  const [view, setView] = useState<'client' | 'login' | 'admin'>('client');
  const [tab, setTab] = useState<'activas' | 'historial' | 'inventario' | 'caja'>('activas');
  const [userRole, setUserRole] = useState<'admin' | 'worker' | null>(null);
  const [userEmail, setUserEmail] = useState('');

  // Login inputs
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Equipo del taller
  const mecanicosEquipo = ['Paul (L.A Custom)', 'Mecánico 1', 'Mecánico 2', 'Ayudante Taller'];

  // Órdenes iniciales
  const [orders, setOrders] = useState<Orden[]>([
    {
      id: '1',
      folio: 'LA-1001',
      fecha: new Date().toISOString().split('T')[0],
      cliente: 'Juan Pérez',
      telefono: '525512345678',
      moto: 'KTM Duke 390',
      placa: 'ABC12',
      km: 15000,
      proximoKm: 18000,
      mecanico: 'Paul (L.A Custom)',
      falla: 'Servicio general y ajuste de cadena',
      refacciones: 'Aceite Motul 10W40, Filtro de aceite',
      total: 1250,
      anticipo: 500,
      estado: 'REPARACIÓN',
      fotos: [],
      archivada: false
    }
  ]);

  const [inventory, setInventory] = useState<RefaccionStock[]>([
    { id: '1', nombre: 'Aceite Motul 10W40', stock: 5, precio: 250 },
    { id: '2', nombre: 'Filtro de Aceite Italika', stock: 8, precio: 90 },
    { id: '3', nombre: 'Bujía NGK Iridio', stock: 4, precio: 180 }
  ]);

  const [searchPlaca, setSearchPlaca] = useState('');
  const [searchHistorial, setSearchHistorial] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null);
  const [ticketOrder, setTicketOrder] = useState<Orden | null>(null);

  // Formulario Nueva Orden
  const [cliente, setCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [moto, setMoto] = useState('');
  const [placa, setPlaca] = useState('');
  const [km, setKm] = useState('');
  const [mecanico, setMecanico] = useState(mecanicosEquipo[0]);
  const [falla, setFalla] = useState('');
  const [refacciones, setRefacciones] = useState('');
  const [total, setTotal] = useState('');
  const [anticipo, setAnticipo] = useState('');
  const [fotosPreview, setFotosPreview] = useState<string[]>([]);

  // Formulario Nuevo Producto Inventario
  const [nombreRef, setNombreRef] = useState('');
  const [stockRef, setStockRef] = useState('');
  const [precioRef, setPrecioRef] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return alert('Ingresa correo y contraseña.');
    const emailClean = emailInput.toLowerCase().trim();
    if (emailClean.includes('admin') || emailClean.includes('dueno') || emailClean === 'paulalbertosanchezangeles@gmail.com') {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.placa.toLowerCase() === searchPlaca.toLowerCase().trim());
    if (found) setSelectedOrder(found);
    else {
      alert('No se encontró ninguna orden con esa placa.');
      setSelectedOrder(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arrayFiles = Array.from(files);
    
    arrayFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotosPreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || !moto) return alert('Escribe al menos el Cliente y la Moto.');

    const kmNum = Number(km) || 0;
    const nuevaOrden: Orden = {
      id: Date.now().toString(),
      folio: `LA-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: new Date().toISOString().split('T')[0],
      cliente,
      telefono: telefono.replace(/[^0-9]/g, ''),
      moto,
      placa: placa.toUpperCase() || 'SIN-PLACA',
      km: kmNum,
      proximoKm: kmNum > 0 ? kmNum + 3000 : 0,
      mecanico,
      falla: falla || 'Mantenimiento técnico',
      refacciones: refacciones || 'Ninguna',
      total: Number(total) || 0,
      anticipo: Number(anticipo) || 0,
      estado: 'INGRESADO',
      fotos: fotosPreview,
      archivada: false
    };

    setOrders([nuevaOrden, ...orders]);
    setCliente(''); setTelefono(''); setMoto(''); setPlaca(''); setKm(''); setFalla(''); setRefacciones(''); setTotal(''); setAnticipo(''); setFotosPreview([]);
    alert('¡Orden registrada con éxito!');
  };

  const cambiarEstado = (orden: Orden, nuevoEstado: Orden['estado']) => {
    setOrders(orders.map(o => o.id === orden.id ? { ...o, estado: nuevoEstado } : o));
    if (nuevoEstado === 'LISTO' && orden.telefono) {
      const restante = orden.total - orden.anticipo;
      const msj = `¡Hola *${orden.cliente}*! 👋 Tu moto *${orden.moto}* ya está *LISTA* en *L.A Custom & Performance*. 🛠️ Restante a pagar: *$${restante}*. ¡Te esperamos!`;
      setTimeout(() => {
        if (confirm(`¿Enviar aviso de listo por WhatsApp a ${orden.cliente}?`)) {
          window.open(`https://wa.me/${orden.telefono}?text=${msj}`, '_blank');
        }
      }, 200);
    }
  };

  const archivarOrden = (id: string) => {
    if (confirm('¿Mandar esta orden al historial?')) {
      setOrders(orders.map(o => o.id === id ? { ...o, archivada: true } : o));
    }
  };

  const desarchivarOrden = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, archivada: false } : o));
  };

  const agregarInventario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreRef) return;
    const nuevo: RefaccionStock = {
      id: Date.now().toString(),
      nombre: nombreRef,
      stock: Number(stockRef) || 0,
      precio: Number(precioRef) || 0
    };
    setInventory([...inventory, nuevo]);
    setNombreRef(''); setStockRef(''); setPrecioRef('');
  };

  const exportarCSV = (datos: any[], nombreArchivo: string) => {
    if (datos.length === 0) return alert('No hay registros para exportar.');
    
    const headers = Object.keys(datos[0]).join(',');
    const rows = datos.map(obj => Object.values(obj).map(v => `"${v}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hoy = new Date().toISOString().split('T')[0];
  const ordenesHoy = orders.filter(o => o.fecha === hoy);
  const totalAnticiposHoy = ordenesHoy.reduce((acc, o) => acc + o.anticipo, 0);

  const ordenesActivas = orders.filter(o => !o.archivada);
  const ordenesHistorial = orders.filter(o => o.archivada && (
    o.folio.toLowerCase().includes(searchHistorial.toLowerCase()) ||
    o.cliente.toLowerCase().includes(searchHistorial.toLowerCase()) ||
    o.placa.toLowerCase().includes(searchHistorial.toLowerCase())
  ));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', paddingBottom: '2rem' }}>
      
      {/* TICKET MODAL DE IMPRESIÓN */}
      {ticketOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', color: '#000', padding: '1.5rem', borderRadius: '0.5rem', width: '100%', maxWidth: '380px', fontFamily: 'monospace' }}>
            
            {/* LOGO EN EL TICKET */}
            <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
              <img 
                src="/logo.png" 
                alt="L.A Custom & Performance Logo" 
                style={{ width: '110px', height: '110px', objectFit: 'contain', margin: '0 auto 0.5rem auto', display: 'block' }} 
              />
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>L.A CUSTOM & PERFORMANCE</h2>
              <p style={{ margin: '0.2rem 0', fontSize: '0.8rem', fontWeight: 'bold' }}>Mantenimiento y Modificaciones</p>
              <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>Folio: <strong>{ticketOrder.folio}</strong> | Fecha: {ticketOrder.fecha}</p>
            </div>

            <hr style={{ border: '1px dashed #000' }} />
            <p style={{ margin: '0.3rem 0' }}><strong>Cliente:</strong> {ticketOrder.cliente}</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Teléfono:</strong> {ticketOrder.telefono || 'N/A'}</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Moto:</strong> {ticketOrder.moto} (Placa: {ticketOrder.placa})</p>
            <p style={{ margin: '0.3rem 0' }}><strong>KM Actual:</strong> {ticketOrder.km} km</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Próximo Servicio:</strong> {ticketOrder.proximoKm} km</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Mecánico:</strong> {ticketOrder.mecanico}</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Trabajo:</strong> {ticketOrder.falla}</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Refacciones:</strong> {ticketOrder.refacciones}</p>
            <hr style={{ border: '1px dashed #000' }} />
            <p style={{ margin: '0.3rem 0' }}><strong>Total:</strong> ${ticketOrder.total}</p>
            <p style={{ margin: '0.3rem 0' }}><strong>Anticipo:</strong> ${ticketOrder.anticipo}</p>
            <p style={{ margin: '0.3rem 0', fontSize: '1.1rem' }}><strong>Restante:</strong> ${ticketOrder.total - ticketOrder.anticipo}</p>
            <hr style={{ border: '1px dashed #000' }} />
            <p style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '1rem' }}>¡Gracias por confiar en L.A Custom & Performance!<br/>Motos sin recoger después de 30 días generan costo de resguardo.</p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button onClick={() => window.print()} style={{ flex: 1, padding: '0.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Imprimir</button>
              <button onClick={() => setTicketOrder(null)} style={{ flex: 1, padding: '0.5rem', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ padding: '1rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🛠️ L.A CUSTOM & PERFORMANCE
        </h1>
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => setView('client')} style={{ padding: '0.4rem 0.8rem', borderRadius: '0.375rem', border: 'none', background: view === 'client' ? '#f59e0b' : '#1e293b', color: view === 'client' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Consulta</button>
          {userRole ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={() => setView('admin')} style={{ padding: '0.4rem 0.8rem', borderRadius: '0.375rem', border: 'none', background: view === 'admin' ? '#f59e0b' : '#1e293b', color: view === 'admin' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Taller</button>
              <button onClick={handleLogout} style={{ padding: '0.4rem 0.6rem', borderRadius: '0.375rem', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Salir</button>
            </div>
          ) : (
            <button onClick={() => setView('login')} style={{ padding: '0.4rem 0.8rem', borderRadius: '0.375rem', border: 'none', background: view === 'login' ? '#f59e0b' : '#1e293b', color: view === 'login' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar</button>
          )}
        </nav>
      </header>

      <main style={{ padding: '1rem', maxWidth: '650px', margin: '0 auto' }}>

        {/* VISTA CLIENTE */}
        {view === 'client' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem', background: '#1e293b', borderRadius: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Consulta el Estado de tu Moto</h2>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <input type="text" placeholder="Ej. ABC12" value={searchPlaca} onChange={(e) => setSearchPlaca(e.target.value)} style={inputStyle} />
                <button type="submit" style={{ padding: '0.75rem 1.25rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>Buscar</button>
              </form>
            </div>
            {selectedOrder && (
              <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '5px solid #f59e0b' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b' }}>Folio: {selectedOrder.folio}</h3>
                <p><strong>Moto:</strong> {selectedOrder.moto} ({selectedOrder.placa})</p>
                <p><strong>Mecánico a cargo:</strong> {selectedOrder.mecanico}</p>
                <p><strong>Trabajo:</strong> {selectedOrder.falla}</p>
                <p style={{ fontSize: '1.1rem' }}><strong>Estado:</strong> <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{selectedOrder.estado}</span></p>
                {selectedOrder.proximoKm > 0 && (
                  <p style={{ color: '#38bdf8', fontSize: '0.9rem' }}>💡 <strong>Próximo servicio recomendado:</strong> a los {selectedOrder.proximoKm} km</p>
                )}
                <hr style={{ borderColor: '#334155', margin: '0.75rem 0' }} />
                <p>Total: ${selectedOrder.total}</p>
                <p style={{ color: '#f59e0b' }}><strong>Restante a Pagar: ${selectedOrder.total - selectedOrder.anticipo}</strong></p>
              </div>
            )}
          </div>
        )}

        {/* VISTA LOGIN */}
        {view === 'login' && (
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '2rem' }}>
            <h2 style={{ textAlign: 'center', margin: '0 0 1rem 0', color: '#f59e0b' }}>Acceso al Personal</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Correo</label>
                <input type="email" placeholder="correo@taller.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} style={{ ...inputStyle, marginTop: '0.25rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Contraseña</label>
                <input type="password" placeholder="••••••••" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} style={{ ...inputStyle, marginTop: '0.25rem' }} />
              </div>
              <button type="submit" style={{ padding: '0.75rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>Iniciar Sesión</button>
            </form>
          </div>
        )}

        {/* VISTA ADMIN / TALLER */}
        {view === 'admin' && userRole && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#334155', padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Usuario: <strong>{userEmail}</strong></span>
              <span style={{ fontSize: '0.75rem', background: userRole === 'admin' ? '#f59e0b' : '#3b82f6', color: '#000', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 'bold' }}>{userRole === 'admin' ? 'ADMIN' : 'TALLER'}</span>
            </div>

            {/* FORMULARIO NUEVA ORDEN */}
            <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '0.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#f59e0b' }}>➕ Nueva Orden de Trabajo</h3>
              <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input type="text" placeholder="Nombre del Cliente *" value={cliente} onChange={(e) => setCliente(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Teléfono WhatsApp" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={inputStyle} />
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="Moto (Modelo) *" value={moto} onChange={(e) => setMoto(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                  <input type="text" placeholder="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="number" placeholder="Kilometraje Actual (KM)" value={km} onChange={(e) => setKm(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  <select value={mecanico} onChange={(e) => setMecanico(e.target.value)} style={{ ...inputStyle, flex: 1, background: '#0f172a', color: '#fff' }}>
                    {mecanicosEquipo.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <textarea placeholder="Falla reportada / Diagnóstico" value={falla} onChange={(e) => setFalla(e.target.value)} rows={2} style={inputStyle} />
                <input type="text" placeholder="Refacciones / Materiales a usar" value={refacciones} onChange={(e) => setRefacciones(e.target.value)} style={inputStyle} />
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="number" placeholder="Presupuesto Total ($)" value={total} onChange={(e) => setTotal(e.target.value)} style={inputStyle} />
                  <input type="number" placeholder="Anticipo Recibido ($)" value={anticipo} onChange={(e) => setAnticipo(e.target.value)} style={inputStyle} />
                </div>

                {/* GALERÍA / FOTOS DE EVIDENCIA */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>📷 Fotos de Recepción / Evidencia de Rayones:</label>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ fontSize: '0.8rem', color: '#94a3b8' }} />
                  {fotosPreview.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', overflowX: 'auto' }}>
                      {fotosPreview.map((f, i) => (
                        <img key={i} src={f} alt="Evidencia" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #f59e0b' }} />
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" style={{ padding: '0.75rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>Guardar Orden</button>
              </form>
            </div>

            {/* PESTAÑAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
              <button onClick={() => setTab('activas')} style={{ padding: '0.5rem 0.2rem', fontSize: '0.75rem', border: 'none', borderRadius: '0.375rem', background: tab === 'activas' ? '#f59e0b' : '#1e293b', color: tab === 'activas' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Activas ({ordenesActivas.length})</button>
              <button onClick={() => setTab('historial')} style={{ padding: '0.5rem 0.2rem', fontSize: '0.75rem', border: 'none', borderRadius: '0.375rem', background: tab === 'historial' ? '#f59e0b' : '#1e293b', color: tab === 'historial' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Historial</button>
              <button onClick={() => setTab('inventario')} style={{ padding: '0.5rem 0.2rem', fontSize: '0.75rem', border: 'none', borderRadius: '0.375rem', background: tab === 'inventario' ? '#f59e0b' : '#1e293b', color: tab === 'inventario' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Inventario</button>
              <button onClick={() => setTab('caja')} style={{ padding: '0.5rem 0.2rem', fontSize: '0.75rem', border: 'none', borderRadius: '0.375rem', background: tab === 'caja' ? '#f59e0b' : '#1e293b', color: tab === 'caja' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Corte Caja</button>
            </div>

            {/* 1. ACTIVAS */}
            {tab === 'activas' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {ordenesActivas.map(o => (
                  <div key={o.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong>{o.folio} - {o.moto}</strong>
                      <span style={{ fontSize: '0.75rem', background: '#334155', color: '#f59e0b', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontWeight: 'bold' }}>{o.estado}</span>
                    </div>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>👤 <strong>Cliente:</strong> {o.cliente}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>🏷️ <strong>Placa:</strong> {o.placa} | ⏱️ <strong>KM:</strong> {o.km} km</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#38bdf8' }}>👨‍🔧 <strong>Asignado a:</strong> {o.mecanico}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>🛠️ <strong>Falla:</strong> {o.falla}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>🔧 <strong>Refacciones:</strong> {o.refacciones}</p>
                    
                    {o.fotos.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Evidencias / Recepción:</span>
                        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                          {o.fotos.map((f, i) => (
                            <img key={i} src={f} alt="Evidencia" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }} onClick={() => window.open(f, '_blank')} />
                          ))}
                        </div>
                      </div>
                    )}

                    <p style={{ margin: '0.5rem 0', fontSize: '0.85rem' }}>💵 Total: ${o.total} | Anticipo: ${o.anticipo} | <strong style={{ color: '#22c55e' }}>Restante: ${o.total - o.anticipo}</strong></p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button onClick={() => setTicketOrder(o)} style={{ flex: 1, padding: '0.4rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>🖨️ Ver Ticket</button>
                      {o.telefono && (
                        <button onClick={() => window.open(`https://wa.me/${o.telefono}?text=Hola%20*${o.cliente}*,%20seguimiento%20de%20tu%20moto%20*${o.moto}*:%20Estado%20actual:%20*${o.estado}*.%20Restante:%20*$${o.total - o.anticipo}*`, '_blank')} style={{ flex: 1, padding: '0.4rem', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>📲 WhatsApp</button>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {(['INGRESADO', 'DIAGNÓSTICO', 'REPARACIÓN', 'LISTO', 'ENTREGADO'] as Orden['estado'][]).map((st) => (
                        <button key={st} onClick={() => cambiarEstado(o, st)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', border: 'none', borderRadius: '0.25rem', background: o.estado === st ? '#f59e0b' : '#334155', color: o.estado === st ? '#000' : '#fff', cursor: 'pointer', fontWeight: o.estado === st ? 'bold' : 'normal' }}>{st}</button>
                      ))}
                    </div>
                    <button onClick={() => archivarOrden(o.id)} style={{ marginTop: '0.75rem', width: '100%', padding: '0.4rem', background: '#334155', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>📦 Archivar Orden</button>
                  </div>
                ))}
              </div>
            )}

            {/* 2. HISTORIAL */}
            {tab === 'historial' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="🔍 Buscar por folio, cliente o placa..." value={searchHistorial} onChange={(e) => setSearchHistorial(e.target.value)} style={inputStyle} />
                  <button onClick={() => exportarCSV(ordenesHistorial, 'Historial_Taller')} style={{ padding: '0.5rem', background: '#22c55e', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>📥 Exportar Excel</button>
                </div>
                {ordenesHistorial.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No hay registros en el historial.</p>
                ) : (
                  ordenesHistorial.map(o => (
                    <div key={o.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #64748b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <strong style={{ color: '#94a3b8' }}>{o.folio} - {o.moto}</strong>
                        <span style={{ fontSize: '0.75rem', background: '#334155', color: '#22c55e', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontWeight: 'bold' }}>ARCHIVADO</span>
                      </div>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>👤 <strong>Cliente:</strong> {o.cliente} | 🏷️ <strong>Placa:</strong> {o.placa}</p>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>👨‍🔧 <strong>Mecánico:</strong> {o.mecanico} | ⏱️ <strong>Próximo servicio:</strong> {o.proximoKm} km</p>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>🛠️ <strong>Trabajo:</strong> {o.falla}</p>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>💵 Total cobrado: ${o.total}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button onClick={() => setTicketOrder(o)} style={{ padding: '0.3rem 0.6rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>🖨️ Ver Ticket</button>
                        <button onClick={() => desarchivarOrden(o.id)} style={{ padding: '0.3rem 0.6rem', background: 'transparent', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>↩️ Reabrir orden</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. INVENTARIO */}
            {tab === 'inventario' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#f59e0b' }}>📦 Agregar Refacción</h4>
                  <form onSubmit={agregarInventario} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input type="text" placeholder="Nombre de la refacción" value={nombreRef} onChange={(e) => setNombreRef(e.target.value)} style={inputStyle} />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="number" placeholder="Stock / Cantidad" value={stockRef} onChange={(e) => setStockRef(e.target.value)} style={inputStyle} />
                      <input type="number" placeholder="Precio ($)" value={precioRef} onChange={(e) => setPrecioRef(e.target.value)} style={inputStyle} />
                    </div>
                    <button type="submit" style={{ padding: '0.5rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar en Stock</button>
                  </form>
                </div>
                <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0 }}>Stock Actual</h4>
                    <button onClick={() => exportarCSV(inventory, 'Inventario_Taller')} style={{ padding: '0.3rem 0.6rem', background: '#22c55e', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' }}>📥 Exportar Stock</button>
                  </div>
                  {inventory.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #334155', fontSize: '0.85rem' }}>
                      <span>{item.nombre}</span>
                      <span>Stock: <strong>{item.stock}</strong> | ${item.precio} c/u</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CORTE DE CAJA */}
            {tab === 'caja' && (
              <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#f59e0b' }}>📊 Corte de Caja de Hoy</h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>Fecha: {hoy}</p>
                  </div>
                  <button onClick={() => exportarCSV(ordenesHoy, `Corte_Caja_${hoy}`)} style={{ padding: '0.4rem 0.8rem', background: '#22c55e', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>📥 Descargar Corte</button>
                </div>

                <div style={{ background: '#334155', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem' }}>Total de Anticipos Recibidos Hoy:</span>
                  <h2 style={{ color: '#22c55e', margin: '0.5rem 0 0 0', fontSize: '2rem' }}>${totalAnticiposHoy}</h2>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>Órdenes registradas hoy ({ordenesHoy.length}):</h4>
                  {ordenesHoy.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No hay movimientos registrados hoy.</p>
                  ) : (
                    ordenesHoy.map(o => (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.3rem 0', borderBottom: '1px solid #334155' }}>
                        <span>{o.folio} - {o.cliente} ({o.mecanico})</span>
                        <span>Anticipo: <strong>${o.anticipo}</strong></span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

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
