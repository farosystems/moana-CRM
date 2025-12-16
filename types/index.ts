// ============================================
// TIPOS DE LA APLICACIÓN - CRM MOANA
// ============================================
// Tipos simplificados para usar en componentes
// ============================================

// Tipo: Sucursal
export interface Sucursal {
  id: string
  nombre: string
  codigo: string
  direccion?: string
  ciudad?: string
  pais?: string
  telefono?: string
  email?: string
  activo?: boolean
  created_at?: string
  updated_at?: string
}

// Tipo: Vendedor
export interface Vendedor {
  id: string
  nombre: string
  apellido: string
  email: string
  whatsapp?: string
  sucursal?: string // Legacy: nombre de sucursal como string
  sucursal_id?: string // ID de la sucursal
  sucursalId?: string // Campo legacy para compatibilidad
  activo?: boolean
  created_at?: string
  updated_at?: string
}

// Tipo: Paquete
export interface Paquete {
  id: string
  nombre: string
  destino: string
  fecha_inicio?: string
  fecha_fin?: string
  fechasDisponibles?: string // Campo legacy para compatibilidad
  cupos: number
  cupos_disponibles?: number
  precio_adulto: number
  precioAdulto?: number // Campo legacy para compatibilidad
  precio_menor?: number
  precioMenor?: number // Campo legacy para compatibilidad
  moneda?: string
  tarifa?: string
  servicios?: string
  politicas?: string
  imagen?: string
  notas?: string
  activo?: boolean
  created_at?: string
  updated_at?: string
}

// Tipo: Cliente
export interface Cliente {
  id: string
  nombre: string
  email: string
  ciudad?: string
  pais?: string
  telefono?: string
  whatsapp?: string
  tipo_cliente?: string
  tipoCliente?: string // Campo legacy para compatibilidad
  documento_id?: string
  documentoId?: string // Campo legacy para compatibilidad
  tipo_documento?: string
  tipoDocumento?: string // Campo legacy para compatibilidad
  destinos_preferidos?: string
  destinosPreferidos?: string // Campo legacy para compatibilidad
  tipo_viajes?: string[]
  tipoViajes?: string[] // Campo legacy para compatibilidad
  presupuesto_promedio?: string
  presupuestoPromedio?: string // Campo legacy para compatibilidad
  frecuencia_viajes?: string
  frecuenciaViajes?: string // Campo legacy para compatibilidad
  total_leads?: number
  leads?: number // Campo legacy para compatibilidad
  leadIds?: string[] // Lista de IDs de leads asociados (no está en DB, se calcula)
  fecha_conversion?: string
  fechaConversion?: string // Campo legacy para compatibilidad
  historial?: HistorialCliente[] // Array de historial (se obtiene de relación)
  activo?: boolean
  created_at?: string
  updated_at?: string
}

// Tipo: Lead
export interface Lead {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  pais?: string
  ciudad?: string
  tipo_consulta: string
  tipoConsulta?: string // Campo legacy para compatibilidad
  origen: string
  estado: string
  vendedor_asignado_id?: string
  vendedorAsignado?: string // Nombre del vendedor (legacy)
  vendedorAsignadoId?: string // Campo legacy para compatibilidad
  paquete_sugerido_id?: string
  paqueteSugerido?: string // Nombre del paquete (legacy)
  paqueteSugeridoId?: string // Campo legacy para compatibilidad
  notas_internas?: string
  notasInternas?: string // Campo legacy para compatibilidad
  fecha_ingreso: string
  fechaIngreso?: string // Campo legacy para compatibilidad
  fecha_ultima_interaccion?: string
  convertido?: boolean
  cliente_id?: string
  fecha_conversion?: string
  created_at?: string
  updated_at?: string
}

// Tipo: Historial de Cliente
export interface HistorialCliente {
  id?: string
  cliente_id?: string
  evento: string
  fecha?: string // Campo legacy para compatibilidad
  descripcion?: string
  usuario?: string
  created_at?: string
}

// Tipo: Historial de Lead
export interface HistorialLead {
  id?: string
  lead_id?: string
  accion: string
  fecha?: string // Campo legacy para compatibilidad
  descripcion?: string
  usuario?: string
  created_at?: string
}

// Tipo: Regla de Asignación
export interface ReglaAsignacion {
  id: string
  nombre: string
  condicion_campo: string
  condicionCampo?: string // Campo legacy para compatibilidad
  condicion_valor: string
  condicionValor?: string // Campo legacy para compatibilidad
  vendedor_id: string
  vendedorId?: string // Campo legacy para compatibilidad
  prioridad?: number
  activa?: boolean
  created_at?: string
  updated_at?: string
}

// Tipos de enumeración
export type TipoCliente = 'empresa' | 'particular'
export type TipoDocumento = 'nif' | 'dni' | 'pasaporte' | 'cif'
export type PresupuestoPromedio = 'bajo' | 'medio' | 'alto'
export type FrecuenciaViajes = 'mensual' | 'trimestral' | 'semestral' | 'anual'
export type EstadoLead = 'Nuevo' | 'En gestión' | 'Cotizado' | 'Cerrado ganado' | 'Cerrado perdido'
export type OrigenLead = 'Web' | 'Instagram' | 'WhatsApp' | 'Facebook' | 'Email' | 'Referido' | 'Otro'
export type TipoConsulta = 'Paquete turístico' | 'Hotel' | 'Vuelo' | 'Crucero' | 'Otro'
export type Moneda = 'USD' | 'EUR' | 'ARS' | 'COP' | 'MXN'

// Tipo: Estadísticas de Vendedor (vista)
export interface EstadisticasVendedor {
  id: string
  nombre: string
  apellido: string
  sucursal?: string
  total_leads: number
  leads_nuevos: number
  leads_en_gestion: number
  leads_cotizados: number
  leads_convertidos: number
  tasa_conversion: number
}

// Tipo: Pipeline de Ventas (vista)
export interface PipelineVentas {
  estado: string
  cantidad: number
  nuevos_esta_semana: number
  nuevos_este_mes: number
}

// Tipo: Lead con información del vendedor (vista)
export interface LeadConVendedor extends Lead {
  vendedor_nombre?: string
  vendedor_email?: string
  vendedor_sucursal?: string
}
