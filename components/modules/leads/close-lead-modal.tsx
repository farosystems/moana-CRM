"use client"

import { useState } from "react"
import { X, Paperclip, Send, Trash2, FileText, Mail, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Lead {
  id: string
  nombre: string
  apellido: string
  email: string
  tipoConsulta: string
}

interface CloseLeadModalProps {
  lead: Lead
  isOpen: boolean
  onClose: () => void
  onSuccess: (leadId: string) => void
}

interface DocumentosState {
  presupuesto: File | null
  contrato: File | null
  voucher: File | null
  condiciones: File | null
}

export function CloseLeadModal({ lead, isOpen, onClose, onSuccess }: CloseLeadModalProps) {
  const [activeTab, setActiveTab] = useState<"documentos" | "email">("documentos")
  const [observaciones, setObservaciones] = useState("")
  const [documentos, setDocumentos] = useState<DocumentosState>({
    presupuesto: null,
    contrato: null,
    voucher: null,
    condiciones: null,
  })

  // Estado para el email
  const [subject, setSubject] = useState(`Documentación de tu viaje - ${lead.nombre} ${lead.apellido}`)
  const [body, setBody] = useState(
    `Estimado/a ${lead.nombre} ${lead.apellido},\n\n` +
    `Nos complace adjuntar la documentación completa para tu ${lead.tipoConsulta}.\n\n` +
    `En este correo encontrarás:\n` +
    `• Presupuesto final\n` +
    `• Contrato de servicios\n` +
    `• Voucher/Reserva\n` +
    `• Condiciones comerciales\n\n` +
    `Por favor, revisa toda la documentación cuidadosamente. Si tienes alguna pregunta o necesitas alguna aclaración, no dudes en contactarnos.\n\n` +
    `Quedamos atentos a tu confirmación.\n\n` +
    `Saludos cordiales,\n` +
    `Equipo Moana CRM`
  )

  const [sending, setSending] = useState(false)
  const [dragActive, setDragActive] = useState<keyof DocumentosState | null>(null)

  if (!isOpen) return null

  const handleFileChange = (tipo: keyof DocumentosState, file: File | null) => {
    setDocumentos((prev) => ({
      ...prev,
      [tipo]: file,
    }))
  }

  const removeFile = (tipo: keyof DocumentosState) => {
    setDocumentos((prev) => ({
      ...prev,
      [tipo]: null,
    }))
  }

  const handleDrag = (e: React.DragEvent, tipo: keyof DocumentosState) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(tipo)
    } else if (e.type === "dragleave") {
      setDragActive(null)
    }
  }

  const handleDrop = (e: React.DragEvent, tipo: keyof DocumentosState) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      // Validar tipo de archivo
      const validTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

      if (validTypes.includes(fileExtension)) {
        handleFileChange(tipo, file)
      } else {
        toast.error("Tipo de archivo no permitido. Solo se aceptan PDF, DOC, DOCX, JPG, JPEG, PNG")
      }
    }
  }

  const handleSubmit = async () => {
    // Validar que al menos un documento esté adjunto
    const tieneDocumentos = Object.values(documentos).some((doc) => doc !== null)

    if (!tieneDocumentos) {
      toast.error("Debes adjuntar al menos un documento")
      return
    }

    if (!lead.email || !subject || !body) {
      toast.error("Por favor completa todos los campos del email")
      return
    }

    setSending(true)

    try {
      // Preparar FormData para enviar email con adjuntos
      const formData = new FormData()
      formData.append("to", lead.email)
      formData.append("subject", subject)
      formData.append("text", body)

      // Convertir saltos de línea a HTML
      const htmlBody = body.replace(/\n/g, "<br>")
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="white-space: pre-wrap;">${htmlBody}</div>
        </div>
      `
      formData.append("html", emailHtml)

      // Agregar archivos adjuntos
      let attachmentIndex = 0
      Object.entries(documentos).forEach(([tipo, file]) => {
        if (file) {
          formData.append(`attachment_${attachmentIndex}`, file)
          attachmentIndex++
        }
      })
      formData.append("attachmentCount", attachmentIndex.toString())

      // Enviar email
      const response = await fetch("/api/email/send", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el email")
      }

      // Actualizar el estado del lead a "Cerrado – Pendiente Administración"
      // Aquí llamarías a tu función de actualización del lead
      toast.success("Documentación enviada y lead cerrado exitosamente")

      // Llamar al callback de éxito
      onSuccess(lead.id)

      onClose()
    } catch (error) {
      console.error("Error al cerrar lead:", error)
      toast.error(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setSending(false)
    }
  }

  const getDocumentLabel = (tipo: keyof DocumentosState): string => {
    const labels = {
      presupuesto: "Presupuesto final",
      contrato: "Contrato",
      voucher: "Voucher / Reserva",
      condiciones: "Condiciones comerciales",
    }
    return labels[tipo]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Cerrar Lead y Enviar Documentación</h2>
            <p className="text-sm text-muted-foreground">
              {lead.nombre} {lead.apellido} - {lead.email}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted/30">
          <button
            onClick={() => setActiveTab("documentos")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "documentos"
                ? "text-orange-600 border-b-2 border-orange-600 bg-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Documentación
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "email"
                ? "text-orange-600 border-b-2 border-orange-600 bg-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === "documentos" ? (
            <>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Adjuntar documentos</h3>
                <p className="text-xs text-muted-foreground">
                  Adjunta los documentos necesarios que se enviarán al cliente por email.
                </p>

                {(Object.keys(documentos) as Array<keyof DocumentosState>).map((tipo) => (
                  <div key={tipo} className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">{getDocumentLabel(tipo)}</Label>

                    {!documentos[tipo] ? (
                      <div
                        onDragEnter={(e) => handleDrag(e, tipo)}
                        onDragLeave={(e) => handleDrag(e, tipo)}
                        onDragOver={(e) => handleDrag(e, tipo)}
                        onDrop={(e) => handleDrop(e, tipo)}
                        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                          dragActive === tipo
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/10"
                            : "border-border hover:border-orange-400 hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileChange(tipo, file)
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id={`file-${tipo}`}
                        />
                        <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                          <Upload className={`w-8 h-8 ${dragActive === tipo ? "text-orange-500" : "text-muted-foreground"}`} />
                          <div className="text-center">
                            <p className="text-sm font-medium text-foreground">
                              {dragActive === tipo ? "Suelta el archivo aquí" : "Arrastra un archivo o haz clic"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PDF, DOC, DOCX, JPG, JPEG, PNG
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate text-foreground">{documentos[tipo].name}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            ({(documentos[tipo].size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(tipo)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 flex-shrink-0 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <Label className="text-sm font-medium text-foreground">
                  Observaciones internas para Administración (opcional)
                </Label>
                <Textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Notas o instrucciones especiales para el equipo de administración..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email-to" className="text-sm font-medium text-foreground">
                    Para
                  </Label>
                  <Input
                    id="email-to"
                    type="email"
                    value={lead.email}
                    disabled
                    className="mt-1 bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="email-subject" className="text-sm font-medium text-foreground">
                    Asunto
                  </Label>
                  <Input
                    id="email-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1"
                    placeholder="Asunto del email"
                  />
                </div>

                <div>
                  <Label htmlFor="email-body" className="text-sm font-medium text-foreground">
                    Mensaje
                  </Label>
                  <Textarea
                    id="email-body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="mt-1 min-h-[300px] font-mono text-sm"
                    placeholder="Escribe el mensaje del email..."
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>Nota:</strong> Los documentos adjuntados en la pestaña "Documentación" se incluirán automáticamente en este email.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {Object.values(documentos).filter((doc) => doc !== null).length} documento(s) adjunto(s)
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={sending}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={sending} className="bg-orange-600 hover:bg-orange-700">
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Cerrar Lead y Enviar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
