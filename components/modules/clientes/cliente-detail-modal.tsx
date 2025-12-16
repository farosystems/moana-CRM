"use client"

import { Button } from "@/components/ui/button"
import { X, Calendar, MapPin, DollarSign, Zap } from "lucide-react"

interface ClienteDetailModalProps {
  isOpen: boolean
  onClose: () => void
  cliente?: any
}

export function ClienteDetailModal({ isOpen, onClose, cliente }: ClienteDetailModalProps) {
  if (!isOpen || !cliente) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-lg w-full sm:w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl sm:rounded-t-lg">
          <h2 className="text-xl font-bold text-foreground">{cliente.nombre}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Datos Básicos */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Información Básica</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{cliente.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="text-sm font-medium text-foreground">{cliente.telefono}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ciudad</p>
                <p className="text-sm font-medium text-foreground">{cliente.ciudad}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">País</p>
                <p className="text-sm font-medium text-foreground">{cliente.pais}</p>
              </div>
            </div>
          </div>

          {/* Documentación */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Documentación</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Tipo de Documento</p>
                <p className="text-sm font-medium text-foreground capitalize">{cliente.tipoDocumento}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Número</p>
                <p className="text-sm font-medium text-foreground">{cliente.documentoId || "No especificado"}</p>
              </div>
            </div>
          </div>

          {/* Preferencias de Viaje */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Preferencias de Viaje</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Destinos Preferidos</p>
                  <p className="text-sm text-foreground">{cliente.destinosPreferidos || "No especificado"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Tipos de Viajes</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {cliente.tipoViajes?.length > 0 ? (
                      cliente.tipoViajes.map((tipo: string) => (
                        <span key={tipo} className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                          {tipo}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No especificado</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Presupuesto Promedio</p>
                  <p className="text-sm text-foreground capitalize">
                    {cliente.presupuestoPromedio || "No especificado"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Frecuencia de Viajes</p>
                  <p className="text-sm text-foreground capitalize">{cliente.frecuenciaViajes || "No especificado"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historial */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Historial</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cliente.historial?.length > 0 ? (
                cliente.historial.map((entry: any, idx: number) => (
                  <div key={idx} className="p-2 bg-muted/50 rounded border border-border text-sm">
                    <p className="text-xs text-muted-foreground">{entry.fecha}</p>
                    <p className="text-foreground">{entry.evento}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sin historial</p>
              )}
            </div>
          </div>

          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-white">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
