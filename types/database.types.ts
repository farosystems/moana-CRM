// ============================================
// TIPOS DE BASE DE DATOS - CRM MOANA
// ============================================
// Tipos TypeScript generados a partir del schema de Supabase
// ============================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      vendedores: {
        Row: {
          id: string
          nombre: string
          apellido: string
          email: string
          whatsapp: string | null
          sucursal: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          apellido: string
          email: string
          whatsapp?: string | null
          sucursal?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          apellido?: string
          email?: string
          whatsapp?: string | null
          sucursal?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      paquetes: {
        Row: {
          id: string
          nombre: string
          destino: string
          fecha_inicio: string | null
          fecha_fin: string | null
          cupos: number
          cupos_disponibles: number
          precio_adulto: number
          precio_menor: number | null
          moneda: string
          tarifa: string | null
          servicios: string | null
          politicas: string | null
          imagen: string | null
          notas: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          destino: string
          fecha_inicio?: string | null
          fecha_fin?: string | null
          cupos?: number
          cupos_disponibles?: number
          precio_adulto: number
          precio_menor?: number | null
          moneda?: string
          tarifa?: string | null
          servicios?: string | null
          politicas?: string | null
          imagen?: string | null
          notas?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          destino?: string
          fecha_inicio?: string | null
          fecha_fin?: string | null
          cupos?: number
          cupos_disponibles?: number
          precio_adulto?: number
          precio_menor?: number | null
          moneda?: string
          tarifa?: string | null
          servicios?: string | null
          politicas?: string | null
          imagen?: string | null
          notas?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      clientes: {
        Row: {
          id: string
          nombre: string
          email: string
          ciudad: string | null
          pais: string | null
          telefono: string | null
          whatsapp: string | null
          tipo_cliente: string | null
          documento_id: string | null
          tipo_documento: string | null
          destinos_preferidos: string | null
          tipo_viajes: string[] | null
          presupuesto_promedio: string | null
          frecuencia_viajes: string | null
          total_leads: number
          fecha_conversion: string
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          email: string
          ciudad?: string | null
          pais?: string | null
          telefono?: string | null
          whatsapp?: string | null
          tipo_cliente?: string | null
          documento_id?: string | null
          tipo_documento?: string | null
          destinos_preferidos?: string | null
          tipo_viajes?: string[] | null
          presupuesto_promedio?: string | null
          frecuencia_viajes?: string | null
          total_leads?: number
          fecha_conversion?: string
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          ciudad?: string | null
          pais?: string | null
          telefono?: string | null
          whatsapp?: string | null
          tipo_cliente?: string | null
          documento_id?: string | null
          tipo_documento?: string | null
          destinos_preferidos?: string | null
          tipo_viajes?: string[] | null
          presupuesto_promedio?: string | null
          frecuencia_viajes?: string | null
          total_leads?: number
          fecha_conversion?: string
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          nombre: string
          apellido: string
          email: string
          telefono: string | null
          pais: string | null
          ciudad: string | null
          tipo_consulta: string
          origen: string
          estado: string
          vendedor_asignado_id: string | null
          paquete_sugerido_id: string | null
          notas_internas: string | null
          fecha_ingreso: string
          fecha_ultima_interaccion: string | null
          convertido: boolean
          cliente_id: string | null
          fecha_conversion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          apellido: string
          email: string
          telefono?: string | null
          pais?: string | null
          ciudad?: string | null
          tipo_consulta: string
          origen: string
          estado?: string
          vendedor_asignado_id?: string | null
          paquete_sugerido_id?: string | null
          notas_internas?: string | null
          fecha_ingreso?: string
          fecha_ultima_interaccion?: string | null
          convertido?: boolean
          cliente_id?: string | null
          fecha_conversion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          apellido?: string
          email?: string
          telefono?: string | null
          pais?: string | null
          ciudad?: string | null
          tipo_consulta?: string
          origen?: string
          estado?: string
          vendedor_asignado_id?: string | null
          paquete_sugerido_id?: string | null
          notas_internas?: string | null
          fecha_ingreso?: string
          fecha_ultima_interaccion?: string | null
          convertido?: boolean
          cliente_id?: string | null
          fecha_conversion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      historial_clientes: {
        Row: {
          id: string
          cliente_id: string
          evento: string
          descripcion: string | null
          usuario: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          evento: string
          descripcion?: string | null
          usuario?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          evento?: string
          descripcion?: string | null
          usuario?: string | null
          created_at?: string
        }
      }
      historial_leads: {
        Row: {
          id: string
          lead_id: string
          accion: string
          descripcion: string | null
          usuario: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          accion: string
          descripcion?: string | null
          usuario?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          accion?: string
          descripcion?: string | null
          usuario?: string | null
          created_at?: string
        }
      }
      reglas_asignacion: {
        Row: {
          id: string
          nombre: string
          condicion_campo: string
          condicion_valor: string
          vendedor_id: string
          prioridad: number
          activa: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          condicion_campo: string
          condicion_valor: string
          vendedor_id: string
          prioridad?: number
          activa?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          condicion_campo?: string
          condicion_valor?: string
          vendedor_id?: string
          prioridad?: number
          activa?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      leads_con_vendedor: {
        Row: {
          id: string
          nombre: string
          apellido: string
          email: string
          telefono: string | null
          pais: string | null
          ciudad: string | null
          tipo_consulta: string
          origen: string
          estado: string
          vendedor_asignado_id: string | null
          paquete_sugerido_id: string | null
          notas_internas: string | null
          fecha_ingreso: string
          fecha_ultima_interaccion: string | null
          convertido: boolean
          cliente_id: string | null
          fecha_conversion: string | null
          created_at: string
          updated_at: string
          vendedor_nombre: string | null
          vendedor_email: string | null
          vendedor_sucursal: string | null
        }
      }
      estadisticas_vendedores: {
        Row: {
          id: string
          nombre: string
          apellido: string
          sucursal: string | null
          total_leads: number
          leads_nuevos: number
          leads_en_gestion: number
          leads_cotizados: number
          leads_convertidos: number
          tasa_conversion: number
        }
      }
      pipeline_ventas: {
        Row: {
          estado: string
          cantidad: number
          nuevos_esta_semana: number
          nuevos_este_mes: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
