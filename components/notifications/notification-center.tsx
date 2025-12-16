"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Nuevo Lead",
      message: "Se ha asignado un nuevo lead a tu cuenta",
      type: "info",
      timestamp: new Date(),
      read: false,
    },
    {
      id: "2",
      title: "Venta Completada",
      message: "Felicidades, completaste una venta",
      type: "success",
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500"
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
      case "warning":
        return "bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500"
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
    }
  }

  return (
    <div className="fixed top-20 right-6 z-50">
      {isOpen && (
        <div className="absolute top-0 right-0 w-96 bg-card border border-border rounded-lg shadow-lg">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-foreground">Notificaciones</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors",
                    !notif.read && "bg-muted",
                  )}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notif.timestamp.toLocaleTimeString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNotification(notif.id)
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">No hay notificaciones</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
