import { useState } from "react"

interface EmailData {
  to: string
  subject: string
  html?: string
  text?: string
}

export function useEmail() {
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendEmail = async (emailData: EmailData) => {
    setSending(true)
    setError(null)

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el email")
      }

      return { success: true, messageId: data.messageId }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setSending(false)
    }
  }

  return { sendEmail, sending, error }
}
