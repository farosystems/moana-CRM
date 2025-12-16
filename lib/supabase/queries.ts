// ============================================
// QUERIES DE SUPABASE - CRM MOANA
// ============================================
// Funciones helper para operaciones comunes con Supabase
// ============================================

import { supabase } from './client'
import type {
  Sucursal,
  Vendedor,
  Paquete,
  Cliente,
  Lead,
  HistorialCliente,
  HistorialLead,
  ReglaAsignacion,
  EstadisticasVendedor,
  PipelineVentas,
} from '@/types'

// ============================================
// VENDEDORES
// ============================================

export const vendedoresQueries = {
  // Obtener todos los vendedores activos con información de sucursal
  getAll: async () => {
    const { data, error } = await supabase
      .from('vendedores')
      .select(`
        *,
        sucursales:sucursal_id (
          id,
          nombre,
          codigo,
          ciudad
        )
      `)
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) throw error

    // Mapear los datos para incluir el nombre de la sucursal en el campo legacy
    const vendedoresConSucursal = data?.map((v: any) => ({
      ...v,
      sucursal: v.sucursales?.nombre || v.sucursal || '-',
      sucursal_nombre: v.sucursales?.nombre,
      sucursal_codigo: v.sucursales?.codigo,
      sucursal_ciudad: v.sucursales?.ciudad,
    })) || []

    return vendedoresConSucursal as Vendedor[]
  },

  // Obtener vendedor por ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('vendedores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Vendedor
  },

  // Crear vendedor
  create: async (vendedor: Omit<Vendedor, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('vendedores')
      .insert(vendedor)
      .select()
      .single()

    if (error) throw error
    return data as Vendedor
  },

  // Actualizar vendedor
  update: async (id: string, updates: Partial<Vendedor>) => {
    const { data, error } = await supabase
      .from('vendedores')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Vendedor
  },

  // Eliminar vendedor (soft delete)
  delete: async (id: string) => {
    const { error } = await supabase
      .from('vendedores')
      .update({ activo: false })
      .eq('id', id)

    if (error) throw error
  },

  // Obtener estadísticas de vendedor
  getEstadisticas: async () => {
    const { data, error } = await supabase
      .from('estadisticas_vendedores')
      .select('*')
      .order('total_leads', { ascending: false })

    if (error) throw error
    return data as EstadisticasVendedor[]
  },
}

// ============================================
// PAQUETES
// ============================================

export const paquetesQueries = {
  // Obtener todos los paquetes activos
  getAll: async () => {
    const { data, error } = await supabase
      .from('paquetes')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Paquete[]
  },

  // Obtener paquetes con cupos disponibles
  getDisponibles: async () => {
    const { data, error } = await supabase
      .from('paquetes')
      .select('*')
      .eq('activo', true)
      .gt('cupos_disponibles', 0)
      .order('fecha_inicio', { ascending: true })

    if (error) throw error
    return data as Paquete[]
  },

  // Obtener paquete por ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('paquetes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Paquete
  },

  // Crear paquete
  create: async (paquete: Omit<Paquete, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('paquetes')
      .insert(paquete)
      .select()
      .single()

    if (error) throw error
    return data as Paquete
  },

  // Actualizar paquete
  update: async (id: string, updates: Partial<Paquete>) => {
    const { data, error } = await supabase
      .from('paquetes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Paquete
  },

  // Eliminar paquete (soft delete)
  delete: async (id: string) => {
    const { error } = await supabase
      .from('paquetes')
      .update({ activo: false })
      .eq('id', id)

    if (error) throw error
  },
}

// ============================================
// CLIENTES
// ============================================

export const clientesQueries = {
  // Obtener todos los clientes
  getAll: async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Cliente[]
  },

  // Obtener cliente por ID con historial
  getById: async (id: string) => {
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single()

    if (clienteError) throw clienteError

    const { data: historial, error: historialError } = await supabase
      .from('historial_clientes')
      .select('*')
      .eq('cliente_id', id)
      .order('created_at', { ascending: false })

    if (historialError) throw historialError

    return { ...cliente, historial } as Cliente & { historial: HistorialCliente[] }
  },

  // Crear cliente
  create: async (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single()

    if (error) throw error
    return data as Cliente
  },

  // Actualizar cliente
  update: async (id: string, updates: Partial<Cliente>) => {
    const { data, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Cliente
  },

  // Eliminar cliente (soft delete)
  delete: async (id: string) => {
    const { error } = await supabase
      .from('clientes')
      .update({ activo: false })
      .eq('id', id)

    if (error) throw error
  },

  // Agregar evento al historial
  addHistorial: async (clienteId: string, evento: string, usuario?: string) => {
    const { data, error } = await supabase
      .from('historial_clientes')
      .insert({
        cliente_id: clienteId,
        evento,
        usuario: usuario || 'Usuario',
      })
      .select()
      .single()

    if (error) throw error
    return data as HistorialCliente
  },
}

// ============================================
// LEADS
// ============================================

export const leadsQueries = {
  // Obtener todos los leads no convertidos
  getAll: async () => {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        vendedor:vendedor_asignado_id (
          id,
          nombre,
          apellido
        ),
        paquete:paquete_sugerido_id (
          id,
          nombre
        )
      `)
      .eq('convertido', false)
      .order('fecha_ingreso', { ascending: false })

    if (error) throw error

    // Mapear los datos para incluir campos legacy
    const leadsConDatos = data?.map((lead: any) => ({
      ...lead,
      vendedorAsignado: lead.vendedor ? `${lead.vendedor.nombre} ${lead.vendedor.apellido}` : '-',
      tipoConsulta: lead.tipo_consulta,
      paqueteSugerido: lead.paquete?.nombre || '-',
      notasInternas: lead.notas_internas,
      fechaIngreso: lead.fecha_ingreso,
    })) || []

    return leadsConDatos as Lead[]
  },

  // Obtener leads con información del vendedor
  getAllConVendedor: async () => {
    const { data, error } = await supabase
      .from('leads_con_vendedor')
      .select('*')
      .eq('convertido', false)
      .order('fecha_ingreso', { ascending: false })

    if (error) throw error
    return data
  },

  // Obtener lead por ID con historial
  getById: async (id: string) => {
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (leadError) throw leadError

    const { data: historial, error: historialError } = await supabase
      .from('historial_leads')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false })

    if (historialError) throw historialError

    return { ...lead, historial } as Lead & { historial: HistorialLead[] }
  },

  // Crear lead
  create: async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single()

    if (error) throw error
    return data as Lead
  },

  // Actualizar lead
  update: async (id: string, updates: Partial<Lead>) => {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Lead
  },

  // Eliminar lead
  delete: async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id)

    if (error) throw error
  },

  // Convertir lead a cliente
  convertir: async (leadId: string, clienteId: string) => {
    const { data, error } = await supabase
      .from('leads')
      .update({
        convertido: true,
        cliente_id: clienteId,
        fecha_conversion: new Date().toISOString(),
      })
      .eq('id', leadId)
      .select()
      .single()

    if (error) throw error
    return data as Lead
  },

  // Agregar evento al historial
  addHistorial: async (leadId: string, accion: string, usuario?: string) => {
    const { data, error } = await supabase
      .from('historial_leads')
      .insert({
        lead_id: leadId,
        accion,
        usuario: usuario || 'Usuario',
      })
      .select()
      .single()

    if (error) throw error
    return data as HistorialLead
  },

  // Obtener pipeline de ventas
  getPipeline: async () => {
    const { data, error } = await supabase.from('pipeline_ventas').select('*')

    if (error) throw error
    return data as PipelineVentas[]
  },
}

// ============================================
// REGLAS DE ASIGNACIÓN
// ============================================

export const reglasQueries = {
  // Obtener todas las reglas activas
  getAll: async () => {
    const { data, error } = await supabase
      .from('reglas_asignacion')
      .select('*, vendedor:vendedores(*)')
      .eq('activa', true)
      .order('prioridad', { ascending: false })

    if (error) throw error
    return data as ReglaAsignacion[]
  },

  // Crear regla
  create: async (regla: Omit<ReglaAsignacion, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('reglas_asignacion')
      .insert(regla)
      .select()
      .single()

    if (error) throw error
    return data as ReglaAsignacion
  },

  // Actualizar regla
  update: async (id: string, updates: Partial<ReglaAsignacion>) => {
    const { data, error } = await supabase
      .from('reglas_asignacion')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as ReglaAsignacion
  },

  // Eliminar regla
  delete: async (id: string) => {
    const { error } = await supabase.from('reglas_asignacion').delete().eq('id', id)

    if (error) throw error
  },
}

// ============================================
// SUCURSALES
// ============================================

export const sucursalesQueries = {
  // Obtener todas las sucursales activas
  getAll: async () => {
    const { data, error } = await supabase
      .from('sucursales')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) throw error
    return data as Sucursal[]
  },

  // Obtener sucursal por ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('sucursales')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Sucursal
  },

  // Crear sucursal
  create: async (sucursal: Omit<Sucursal, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('sucursales')
      .insert(sucursal as any)
      .select()
      .single()

    if (error) throw error
    return data as Sucursal
  },

  // Actualizar sucursal
  update: async (id: string, sucursal: Partial<Sucursal>) => {
    const { data, error } = await supabase
      .from('sucursales')
      .update(sucursal as any)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Sucursal
  },

  // Eliminar sucursal (soft delete)
  delete: async (id: string) => {
    const { error } = await supabase
      .from('sucursales')
      .update({ activo: false } as any)
      .eq('id', id)

    if (error) throw error
  },
}
