import { OrdenTrabajo } from './types';

export const INITIAL_ORDERS: OrdenTrabajo[] = [
  {
    id: 'OT-101',
    clienteNombre: 'Carlos Mendoza',
    telefono: '3001234567',
    placa: 'ABC12D',
    modeloMoto: 'Yamaha FZ 250',
    estado: 'DIAGNÓSTICO',
    diagnostico: 'Fallo en sistema de inyección y cambio de discos de freno delanteros.',
    presupuestoTotal: 185000,
    fechaIngreso: '2026-07-28',
    fotos: []
  },
  {
    id: 'OT-102',
    clienteNombre: 'Mariana Gómez',
    telefono: '3119876543',
    placa: 'XYZ89F',
    modeloMoto: 'KTM Duke 390',
    estado: 'REPUESTOS',
    diagnostico: 'Esperando kit de arrastre original y filtro de aire de alto flujo.',
    presupuestoTotal: 340000,
    fechaIngreso: '2026-07-29',
    fotos: []
  },
  {
    id: 'OT-103',
    clienteNombre: 'Roberto Silva',
    telefono: '3155551234',
    placa: 'MNO45E',
    modeloMoto: 'Honda CB 190R',
    estado: 'LISTO',
    diagnostico: 'Mantenimiento general completado: cambio de aceite, ajuste de cadena y calibración de válvulas.',
    presupuestoTotal: 120000,
    fechaIngreso: '2026-07-30',
    fotos: []
  },
  {
    id: 'OT-104',
    clienteNombre: 'Andrea López',
    telefono: '3204448899',
    placa: 'JKL67G',
    modeloMoto: 'Bajaj Pulsar NS 200',
    estado: 'INGRESADO',
    diagnostico: 'Revisión por ruido extraño en motor al superar 60 km/h.',
    presupuestoTotal: 90000,
    fechaIngreso: '2026-07-31',
    fotos: []
  },
  {
    id: 'OT-105',
    clienteNombre: 'Juan Pérez',
    telefono: '3017772211',
    placa: 'PQR12H',
    modeloMoto: 'Suzuki GIXER 150',
    estado: 'REPARACIÓN',
    diagnostico: 'Cambio de cuna de dirección y empaque de culata en proceso.',
    presupuestoTotal: 210000,
    fechaIngreso: '2026-07-27',
    fotos: []
  }
];
