import { useState, useEffect } from "react"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications/me')
        // Handle both response.data.data and response.data directly
        const notifData = response.data?.data || response.data || []
        if (Array.isArray(notifData)) {
          setNotifications(notifData)
        }
      } catch (err) {
        console.error("Error fetching notifications:", err)
        // Mock fallback data for development
        setNotifications([
          {
            id: 1,
            title: "Klaim Anda Diverifikasi",
            message: "Klaim untuk 'Kunci Lemari Eiger' telah diverifikasi oleh admin.",
            type: "claim_verified",
            is_read: false,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            title: "Barang Baru Ditemukan",
            message: "Ada barang temuan baru yang cocok dengan laporan Anda. Silakan cek!",
            type: "new_item",
            is_read: false,
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 3,
            title: "Notifikasi Sistem",
            message: "Sistem telah diperbarui dengan fitur pencarian yang lebih baik.",
            type: "system",
            is_read: true,
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev =>
        prev.map(notif => notif.id === id ? { ...notif, is_read: true } : notif)
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      // Fallback: update local state anyway
      setNotifications(prev =>
        prev.map(notif => notif.id === id ? { ...notif, is_read: true } : notif)
      )
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
    } catch (error) {
      console.error("Error marking all as read:", error)
      // Fallback: update local state anyway
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length
  const getNotificationColor = (type) => {
    switch (type) {
      case 'claim_verified':
        return 'bg-blue-50 border-blue-200'
      case 'claim_rejected':
        return 'bg-red-50 border-red-200'
      case 'new_item':
        return 'bg-green-50 border-green-200'
      case 'system':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifikasi</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pantau semua pemberitahuan penting dari sistem
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            Tandai Semua Terbaca ({unreadCount})
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground animate-pulse">Memuat notifikasi Anda...</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Anda tidak memiliki notifikasi.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all border ${getNotificationColor(notification.type)} ${
                !notification.is_read ? 'ring-2 ring-ring ring-offset-2' : ''
              }`}
              onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base line-clamp-1">
                      {notification.title}
                      {!notification.is_read && (
                        <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {notification.message}
                    </CardDescription>
                  </div>
                  {!notification.is_read && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleDateString("id-ID", {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
