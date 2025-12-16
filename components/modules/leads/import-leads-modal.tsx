"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface ImportLeadsModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (leads: any[]) => void
}

export function ImportLeadsModal({ isOpen, onClose, onSubmit }: ImportLeadsModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const processFile = (file: File) => {
    setFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((l) => l.trim())
      const headers = lines[0].split(",").map((h) => h.trim())

      const importedLeads = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        return {
          cliente: values[0] || "",
          descripcion: values[1] || "",
          valor: Number.parseFloat(values[2]) || 0,
          email: values[3] || "",
          telefono: values[4] || "",
        }
      })

      setPreview(importedLeads.slice(0, 5))
    }
    reader.readAsText(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    if (file && preview.length > 0) {
      onSubmit(preview)
      setFile(null)
      setPreview([])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Leads desde Excel</DialogTitle>
          <DialogDescription>Carga un archivo CSV con los leads que deseas importar</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              dragActive ? "border-orange-600 bg-orange-50 dark:bg-orange-900/10" : "border-border"
            }`}
          >
            <input type="file" accept=".csv,.xlsx" onChange={handleFileInput} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-2 text-orange-600" />
              <p className="font-medium text-foreground">Arrastra tu archivo aquí o haz clic</p>
              <p className="text-sm text-muted-foreground">Soporta CSV y XLSX</p>
            </label>
          </div>

          {file && (
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{file.size} bytes</p>
                </div>
                <button
                  onClick={() => {
                    setFile(null)
                    setPreview([])
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {preview.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Vista previa ({preview.length} leads)</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {preview.map((lead, idx) => (
                      <div key={idx} className="bg-background p-2 rounded text-sm">
                        <p className="font-medium text-foreground">{lead.cliente}</p>
                        <p className="text-muted-foreground">{lead.descripcion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!file || preview.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Importar {preview.length > 0 ? `(${preview.length})` : ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
