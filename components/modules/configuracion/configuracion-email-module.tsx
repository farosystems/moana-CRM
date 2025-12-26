"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Eye, EyeOff, Save, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

export function ConfiguracionEmailModule() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    smtp_host: "",
    smtp_port: 587,
    smtp_user: "",
    smtp_password: "",
    smtp_secure: false,
    email_from: "",
    email_from_name: "",
  })

  useEffect(() => {
    fetchConfiguracion()
  }, [])

  const fetchConfiguracion = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("configuracion_email")
        .select("*")
        .eq("activo", true)
        .single()

      if (fetchError) {
        // Si no hay configuración, usar valores por defecto
        if (fetchError.code === "PGRST116") {
          console.log("No hay configuración de email, usando valores por defecto")
          return
        }
        throw fetchError
      }

      if (data) {
        setFormData({
          smtp_host: data.smtp_host || "",
          smtp_port: data.smtp_port || 587,
          smtp_user: data.smtp_user || "",
          smtp_password: data.smtp_password || "",
          smtp_secure: data.smtp_secure || false,
          email_from: data.email_from || "",
          email_from_name: data.email_from_name || "",
        })
      }
    } catch (err) {
      console.error("Error al cargar configuración:", err)
      setError("No se pudo cargar la configuración de correo")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Verificar si ya existe una configuración
      const { data: existingConfig } = await supabase
        .from("configuracion_email")
        .select("id")
        .eq("activo", true)
        .single()

      if (existingConfig) {
        // Actualizar configuración existente
        const { error: updateError } = await supabase
          .from("configuracion_email")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingConfig.id)

        if (updateError) throw updateError
      } else {
        // Crear nueva configuración
        const { error: insertError } = await supabase
          .from("configuracion_email")
          .insert({
            ...formData,
            activo: true,
          })

        if (insertError) throw insertError
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Error al guardar configuración:", err)
      setError("No se pudo guardar la configuración")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración de Email</h1>
          <p className="text-muted-foreground mt-1">Configura el servidor SMTP para el envío de correos</p>
        </div>
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Cargando configuración...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración de Email</h1>
        <p className="text-muted-foreground mt-1">
          Configura el servidor SMTP para el envío de correos electrónicos desde el sistema
        </p>
      </div>

      <Card className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del servidor SMTP */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Configuración SMTP</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Servidor SMTP *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="smtp.gmail.com"
                  value={formData.smtp_host}
                  onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ejemplos: smtp.gmail.com, smtp.office365.com, smtp.sendgrid.net
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Puerto SMTP *</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="587"
                  value={formData.smtp_port}
                  onChange={(e) => setFormData({ ...formData, smtp_port: parseInt(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground mt-1">587 (TLS) o 465 (SSL)</p>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border"
                    checked={formData.smtp_secure}
                    onChange={(e) => setFormData({ ...formData, smtp_secure: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-foreground">Usar SSL/TLS</span>
                </label>
              </div>
            </div>
          </div>

          {/* Credenciales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Credenciales</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Usuario SMTP *</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="tu-email@gmail.com"
                  value={formData.smtp_user}
                  onChange={(e) => setFormData({ ...formData, smtp_user: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contraseña SMTP *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••••••••••"
                    value={formData.smtp_password}
                    onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Para Gmail, usa una contraseña de aplicación (no tu contraseña normal)
                </p>
              </div>
            </div>
          </div>

          {/* Información del remitente */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Remitente</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email del remitente *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="tu-email@gmail.com"
                  value={formData.email_from}
                  onChange={(e) => setFormData({ ...formData, email_from: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre del remitente *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Moana CRM"
                  value={formData.email_from_name}
                  onChange={(e) => setFormData({ ...formData, email_from_name: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">
                Configuración guardada exitosamente
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-foreground border-border hover:bg-muted"
              onClick={fetchConfiguracion}
              disabled={saving}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recargar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Guardando..." : "Guardar Configuración"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Información de ayuda */}
      <Card className="p-4 md:p-6 bg-muted/50">
        <h3 className="text-sm font-semibold text-foreground mb-2">Configuración para Gmail</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Servidor: smtp.gmail.com</li>
          <li>• Puerto: 587 (TLS)</li>
          <li>• Crea una contraseña de aplicación en tu cuenta de Google</li>
          <li>• Habilita la verificación en 2 pasos en tu cuenta</li>
          <li>
            • Genera la contraseña en:{" "}
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google App Passwords
            </a>
          </li>
        </ul>
      </Card>
    </div>
  )
}
