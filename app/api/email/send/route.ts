import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    let to, subject, html, text, attachments = []

    // Detectar si es FormData (con adjuntos) o JSON (sin adjuntos)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      to = formData.get("to") as string
      subject = formData.get("subject") as string
      html = formData.get("html") as string
      text = formData.get("text") as string

      const attachmentCount = parseInt(formData.get("attachmentCount") as string || "0")

      // Procesar archivos adjuntos
      for (let i = 0; i < attachmentCount; i++) {
        const file = formData.get(`attachment_${i}`) as File
        if (file) {
          const buffer = Buffer.from(await file.arrayBuffer())
          attachments.push({
            filename: file.name,
            content: buffer,
          })
        }
      }
    } else {
      const body = await request.json()
      to = body.to
      subject = body.subject
      html = body.html
      text = body.text
    }

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: to, subject, html o text" },
        { status: 400 }
      )
    }

    // Obtener la configuración de email activa
    const { data: config, error: configError } = await supabase
      .from("configuracion_email")
      .select("*")
      .eq("activo", true)
      .single()

    if (configError || !config) {
      return NextResponse.json(
        { error: "No hay configuración de email activa. Configura el SMTP en Configuración." },
        { status: 500 }
      )
    }

    // Crear el transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: config.smtp_host,
      port: config.smtp_port,
      secure: config.smtp_secure, // true para 465, false para otros puertos
      auth: {
        user: config.smtp_user,
        pass: config.smtp_password,
      },
    })

    // Verificar la conexión
    try {
      await transporter.verify()
    } catch (verifyError) {
      console.error("Error al verificar conexión SMTP:", verifyError)
      return NextResponse.json(
        { error: "Error al conectar con el servidor SMTP. Verifica la configuración." },
        { status: 500 }
      )
    }

    // Enviar el email
    const info = await transporter.sendMail({
      from: `"${config.email_from_name}" <${config.email_from}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: "Email enviado exitosamente",
    })
  } catch (error) {
    console.error("Error al enviar email:", error)
    return NextResponse.json(
      { error: "Error al enviar el email", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
