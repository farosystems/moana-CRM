"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, X, Save } from "lucide-react"

interface AssignmentRule {
  id: string
  nombre: string
  condicion: string
  vendedor: string
  activa: boolean
}

interface AssignmentRulesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AssignmentRulesModal({ isOpen, onClose }: AssignmentRulesModalProps) {
  const [rules, setRules] = useState<AssignmentRule[]>([
    {
      id: "1",
      nombre: "Leads de alto valor",
      condicion: "valor > 5000",
      vendedor: "María López",
      activa: true,
    },
    {
      id: "2",
      nombre: "Leads de turismo nacional",
      condicion: "país = México",
      vendedor: "Carlos González",
      activa: true,
    },
  ])

  const [newRule, setNewRule] = useState({
    nombre: "",
    condicion: "",
    vendedor: "",
  })

  const handleAddRule = () => {
    if (newRule.nombre && newRule.condicion && newRule.vendedor) {
      setRules([
        ...rules,
        {
          id: String(rules.length + 1),
          ...newRule,
          activa: true,
        },
      ])
      setNewRule({ nombre: "", condicion: "", vendedor: "" })
    }
  }

  const toggleRule = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, activa: !r.activa } : r)))
  }

  const deleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reglas de Asignación Automática</DialogTitle>
          <DialogDescription>Configura reglas para asignar leads automáticamente a vendedores</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4 bg-card border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground">Crear Nueva Regla</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre de la regla"
                value={newRule.nombre}
                onChange={(e) => setNewRule({ ...newRule, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Condición (ej: valor > 5000)"
                value={newRule.condicion}
                onChange={(e) => setNewRule({ ...newRule, condicion: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={newRule.vendedor}
                onChange={(e) => setNewRule({ ...newRule, vendedor: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecciona vendedor</option>
                <option value="Carlos González">Carlos González</option>
                <option value="María López">María López</option>
                <option value="Juan Pérez">Juan Pérez</option>
              </select>
              <Button onClick={handleAddRule} className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2">
                <Plus className="w-4 h-4" />
                Agregar Regla
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Reglas Activas</h3>
            {rules.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay reglas configuradas</p>
            ) : (
              <div className="space-y-2">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                    <input
                      type="checkbox"
                      checked={rule.activa}
                      onChange={() => toggleRule(rule.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{rule.nombre}</p>
                      <p className="text-xs text-muted-foreground">{rule.condicion}</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Asignar a: {rule.vendedor}</p>
                    </div>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button onClick={onClose} variant="outline">
              Cerrar
            </Button>
            <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <Save className="w-4 h-4" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
