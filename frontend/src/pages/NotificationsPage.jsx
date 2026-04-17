import { useState, useEffect } from "react"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PageState from "@/components/PageState"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/notifications/me')
      const notifData = response.data?.data || response.data || []
      if (Array.isArray(notifData)) {
        setNotifications(notifData)
      } else {
        setNotifications([])
      }
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError(err.response?.data?.detail || "Gagal memuat notifikasi Anda.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
    } catch (error) {
      console.error("Error marking all as read:", error)
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
        return 'bg-card border-border'
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

      {loading && <PageState state="loading" loadingText="Memuat notifikasi Anda..." />}
      {!loading && error && <PageState state="error" errorText={error} onRetry={fetchNotifications} />}

      {!loading && !error && notifications.length === 0 ? (
        <PageState state="empty" emptyText="Anda tidak memiliki notifikasi." />
      ) : (
        !loading && !error && (
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
                      <CardDescription className="mt-1 line-clamp-2 text-foreground/80">
                        {notification.message}
                      </CardDescription>
                    </div>
                    {!notification.is_read && (
                      <div className="flex-shrink-0 mt-1">
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
        )
      )}
    </div>
  )
}
