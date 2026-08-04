export type EstadoMoto = 'INGRESADO' | 'DIAGNÓSTICO' | 'REPUESTOS' | 'REPARACIÓN' | 'PRUEBAS' | 'LISTO' | 'ENTREGADO';

export interface OrdenTrabajo {
  id: string;
  clienteNombre: string;
  telefono: string;
  placa: string;
  modeloMoto: string;
  estado: EstadoMoto;
  diagnostico: string;
  presupuestoTotal: number;
  fechaIngreso: string;
  fotos: string[];
}
