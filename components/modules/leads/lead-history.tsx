"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LeadHistoryProps {
  leadId: string
  history: any[]
  onClose: () => void
}

export function LeadHistory({ leadId, history, onClose }: LeadHistoryProps) {
  return (
    <Dialog open={!!leadId} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historial del Lead</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay historial disponible</div>
          ) : (
            <div className="space-y-3">
              {history.map((entry, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-border last:border-0">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-orange-600 mt-1.5"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="font-medium text-foreground text-sm sm:text-base">{entry.accion}</p>
                      <p className="text-xs text-muted-foreground">{entry.fecha}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Por: {entry.usuario}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
