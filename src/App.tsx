import React, { useState } from 'react';
import { INITIAL_ORDERS } from './mockData';
import { OrdenTrabajo, EstadoMoto } from './types';
import { Wrench, Search, Phone, Shield, CheckCircle, Clock, FileText, Send, User, Bike } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'home' | 'admin' | 'client'>('home');
  const [orders, setOrders] = useState<OrdenTrabajo[]>(INITIAL_ORDERS);
  const [searchPlaca, setSearchPlaca] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrdenTrabajo | null>(null);

  // Stats calculation
  const totalInTaller = orders.filter(o => o.estado !== 'ENTREGADO').length;
  const listos = orders.filter(o => o.estado === 'LISTO').length;
  const pendientes = orders.filter(o => ['INGRESADO', 'DIAGNÓSTICO', 'REPUESTOS', 'REPARACIÓN', 'PRUEBAS'].includes(o.estado)).length;

  const handleStatusChange = (id: string, newStatus: EstadoMoto) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, estado: newStatus } : o));
  };

  const handleSearchClient = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.placa.toUpperCase() === searchPlaca.trim().toUpperCase() || o.telefono === searchPlaca.trim());
    if (found) {
      setSelectedOrder(found);
    } else {
      alert('No se encontró ninguna moto registrada con esa placa o teléfono. Prueba con: ABC12D');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-amber-500 p-2 rounded-lg text-slate-950 font-black text-xl">LA</div>
            <span className="text-2xl font-black tracking-wider text-slate-100">L.A. <span className="text-amber-500">CONTROL</span></span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setView('admin')} 
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${view === 'admin' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
            >
              <Shield className="w-4 h-4" /> Panel Taller
            </button>
            <button 
              onClick={() => setView('client')} 
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${view === 'client' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
            >
              <Bike className="w-4 h-4" /> Seguir mi Moto
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        {/* HOME VIEW */}
        {view === 'home' && (
          <div className="space-y-12 py-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-100">
                L.A. <span className="text-amber-500">CONTROL</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Gestión completa de reparaciones. Sigue tu moto en tiempo real, aprueba presupuestos y recibe notificaciones por WhatsApp en cada etapa del proceso.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button onClick={() => setView('admin')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Acceso del Taller
                </button>
                <button onClick={() => setView('client')} className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 border border-slate-700">
                  <Bike className="w-5 h-5" /> Seguir mi Moto
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <Wrench className="w-10 h-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-100">Órdenes de Trabajo</h3>
                <p className="text-slate-400 text-sm mt-2">Diagnóstico, repuestos y mano de obra en un solo lugar.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <Send className="w-10 h-10 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-100">Notificaciones WhatsApp</h3>
                <p className="text-slate-400 text-sm mt-2">Avisos automáticos al cliente en cada cambio de estado.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <Bike className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-100">Portal del Cliente</h3>
                <p className="text-slate-400 text-sm mt-2">Seguimiento en vivo con fotos y línea de tiempo clara.</p>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {view === 'admin' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-100">Resumen del Taller</h2>
                <p className="text-slate-400 text-sm">Control e inventario activo de vehículos</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20">
                Modo Demo Activo (Bypassed)
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase">En el Taller</p>
                  <p className="text-3xl font-black text-slate-100 mt-1">{totalInTaller}</p>
                </div>
                <Bike className="w-8 h-8 text-amber-500" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase">Listas para Entrega</p>
                  <p className="text-3xl font-black text-emerald-400 mt-1">{listos}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase">Pendientes</p>
                  <p className="text-3xl font-black text-blue-400 mt-1">{pendientes}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 font-bold text-slate-200">
                Órdenes de Trabajo Activas
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                    <tr>
                      <th className="p-4">Orden / Moto</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Diagnóstico</th>
                      <th className="p-4">Presupuesto</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-center">Acción WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-800/50">
                        <td className="p-4">
                          <div className="font-bold text-amber-400">{order.placa}</div>
                          <div className="text-xs text-slate-400">{order.modeloMoto} ({order.id})</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold">{order.clienteNombre}</div>
                          <div className="text-xs text-slate-400">{order.telefono}</div>
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-300">
                          {order.diagnostico}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-200">
                          ${order.presupuestoTotal.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <select 
                            value={order.estado}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as EstadoMoto)}
                            className="bg-slate-950 border border-slate-700 rounded-lg text-xs font-semibold p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                          >
                            <option value="INGRESADO">INGRESADO</option>
                            <option value="DIAGNÓSTICO">DIAGNÓSTICO</option>
                            <option value="REPUESTOS">REPUESTOS</option>
                            <option value="REPARACIÓN">REPARACIÓN</option>
                            <option value="PRUEBAS">PRUEBAS</option>
                            <option value="LISTO">LISTO</option>
                            <option value="ENTREGADO">ENTREGADO</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => alert(`[SIMULACIÓN WHATSAPP] Notificación enviada a ${order.clienteNombre} (${order.telefono}): 'Su moto ${order.modeloMoto} con placa ${order.placa} ha cambiado al estado: ${order.estado}'`)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition inline-flex items-center justify-center gap-1 text-xs"
                            title="Enviar aviso por WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" /> Enviar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CLIENT VIEW */}
        {view === 'client' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-100">Portal del Cliente</h2>
              <p className="text-slate-400 text-sm">Ingresa tu placa o número telefónico para conocer el estado de tu vehículo.</p>
            </div>

            <form onSubmit={handleSearchClient} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-3.5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Ej. ABC12D o 3001234567"
                  value={searchPlaca}
                  onChange={(e) => setSearchPlaca(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono uppercase"
                />
              </div>
              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition">
                Buscar
              </button>
            </form>

            {selectedOrder && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fadeIn">
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                  <div>
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {selectedOrder.estado}
                    </span>
                    <h3 className="text-2xl font-black text-slate-100 mt-2">{selectedOrder.modeloMoto}</h3>
                    <p className="text-slate-400 text-sm">Placa: <span className="font-mono font-bold text-amber-400">{selectedOrder.placa}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Orden de Trabajo</p>
                    <p className="text-lg font-mono font-bold text-slate-200">{selectedOrder.id}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs uppercase text-slate-400 font-bold">Diagnóstico Técnico</h4>
                  <p className="bg-slate-950 p-4 rounded-xl text-slate-300 text-sm border border-slate-800">
                    {selectedOrder.diagnostico}
                  </p>
                </div>

                <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-sm font-semibold">Presupuesto Estimado:</span>
                  <span className="text-xl font-mono font-black text-amber-400">${selectedOrder.presupuestoTotal.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © 2026 L.A. CONTROL. Todos los derechos reservados.
      </footer>
    </div>
  );
}
