"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Check } from "lucide-react"

interface Lead {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  tipoConsulta: string
  origen: string
  estado: string
}

interface Cliente {
  id: string
  nombre: string
}

interface ConvertLeadModalProps {
  isOpen: boolean
  onClose: () => void
  lead?: Lead
  clientes: Cliente[]
  onConvert: (leadId: string, clienteId: string) => void
}

export function ConvertLeadModal({ isOpen, onClose, lead, clientes, onConvert }: ConvertLeadModalProps) {
  const [selectedCliente, setSelectedCliente] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (lead && selectedCliente) {
      onConvert(lead.id, selectedCliente)
      setSelectedCliente("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-lg w-full sm:w-[500px] max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl sm:rounded-t-lg">
          <h2 className="text-xl font-bold text-foreground">Convertir Lead a Cliente</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {lead && (
            <div className="bg-muted p-4 rounded-lg border border-border">
              <label className="block text-sm font-medium text-foreground mb-2">Lead a convertir</label>
              <p className="text-foreground font-medium">
                {lead.nombre} {lead.apellido}
              </p>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
              <p className="text-sm text-muted-foreground">{lead.telefono}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Asignar al Cliente</label>
            <select
              required
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Selecciona un cliente --</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              El lead será vinculado al cliente seleccionado y se agregará al historial de ambos registros.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-foreground border-border hover:bg-muted bg-transparent"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Check className="w-4 h-4" />
              Convertir
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
