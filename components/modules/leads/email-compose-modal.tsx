"use client"

import { useState } from "react"
import { X, Paperclip, Send, Trash2 } from "lucide-react"
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

interface EmailComposeModalProps {
  lead: Lead
  isOpen: boolean
  onClose: () => void
  defaultTemplate?: {
    subject: string
    body: string
  }
}

export function EmailComposeModal({ lead, isOpen, onClose, defaultTemplate }: EmailComposeModalProps) {
  const [subject, setSubject] = useState(defaultTemplate?.subject || `Consulta: ${lead.tipoConsulta}`)
  const [body, setBody] = useState(
    defaultTemplate?.body ||
      `Hola ${lead.nombre} ${lead.apellido},\n\nGracias por tu consulta sobre ${lead.tipoConsulta}.\n\nEstamos encantados de ayudarte con tu viaje. Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo pronto.\n\nSi tienes alguna pregunta adicional, no dudes en contactarnos.\n\nSaludos cordiales,\nEquipo Moana CRM`
  )
  const [attachments, setAttachments] = useState<File[]>([])
  const [sending, setSending] = useState(false)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (!lead.email || !subject || !body) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setSending(true)

    try {
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
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file)
      })
      formData.append("attachmentCount", attachments.length.toString())

      const response = await fetch("/api/email/send", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el email")
      }

      toast.success("Email enviado exitosamente")
      onClose()
    } catch (error) {
      console.error("Error al enviar email:", error)
      toast.error(`Error al enviar email: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Enviar Email a {lead.nombre} {lead.apellido}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="to" className="text-sm font-medium text-foreground">
              Para
            </Label>
            <Input
              id="to"
              type="email"
              value={lead.email}
              disabled
              className="mt-1 bg-muted"
            />
          </div>

          <div>
            <Label htmlFor="subject" className="text-sm font-medium text-foreground">
              Asunto *
            </Label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1"
              placeholder="Asunto del email"
            />
          </div>

          <div>
            <Label htmlFor="body" className="text-sm font-medium text-foreground">
              Mensaje *
            </Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 min-h-[250px] font-mono text-sm"
              placeholder="Escribe tu mensaje aquí..."
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Archivos Adjuntos</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="flex-1"
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                    <span>
                      <Paperclip className="w-4 h-4 mr-2" />
                      Adjuntar
                    </span>
                  </Button>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="border border-border rounded-md p-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate text-foreground">{file.name}</span>
                        <span className="text-muted-foreground text-xs flex-shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="h-6 w-6 p-0 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 flex-shrink-0 ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background border-t border-border p-4 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={sending} className="bg-orange-600 hover:bg-orange-700">
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Email
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
