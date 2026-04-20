import { useEffect, useMemo, useState } from "react"
import { BellRingIcon, CheckCheckIcon, MailboxIcon } from "lucide-react"

import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import PageState from "@/components/PageState"

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
})

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get("/notifications/me")
      const notifData = response.data?.data || response.data || []
      setNotifications(Array.isArray(notifData) ? notifData : [])
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
      setNotifications((prev) => prev.map((notif) => notif.id === id ? { ...notif, is_read: true } : notif))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all")
      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.is_read).length
  const readCount = notifications.length - unreadCount

  const summary = useMemo(() => [
    { label: "Total Notifikasi", value: notifications.length, tone: "bg-brand-soft text-brand" },
    { label: "Belum Dibaca", value: unreadCount, tone: "bg-warning-soft text-warning-foreground" },
    { label: "Sudah Dibaca", value: readCount, tone: "bg-success-soft text-success-foreground" },
  ], [notifications.length, unreadCount, readCount])

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section className="rounded-[2rem] border border-brand/10 bg-surface-elevated/85 p-6 shadow-[0_22px_60px_-34px_rgba(83,40,190,0.32)] backdrop-blur md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <Badge variant="secondary" className="w-fit bg-brand-soft text-brand">
              Riwayat Pemberitahuan
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Semua update penting terkumpul di satu tempat.</h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Pantau perubahan status, tindak lanjut klaim, dan informasi penting lain dengan tampilan yang lebih jelas dan lebih mudah dipindai.
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="lg" onClick={handleMarkAllAsRead}>
              Tandai Semua Terbaca ({unreadCount})
            </Button>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label} className="bg-surface-elevated/75">
            <CardHeader className="gap-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold tracking-tight">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={item.tone}>{item.label}</Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      {loading && <PageState state="loading" loadingText="Memuat notifikasi Anda…" />}
      {!loading && error && <PageState state="error" errorText={error} onRetry={fetchNotifications} />}

      {!loading && !error && notifications.length === 0 ? (
        <Card className="border-brand/10 bg-surface-elevated/80">
          <CardHeader>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <MailboxIcon aria-hidden="true" />
            </div>
            <CardTitle>Belum Ada Notifikasi</CardTitle>
            <CardDescription>Begitu sistem mulai mengirim pemberitahuan, daftar lengkapnya akan muncul di halaman ini.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        !loading && !error && (
          <section className="grid gap-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="bg-surface-elevated/80">
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                          <BellRingIcon aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="line-clamp-1">{notification.title}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-3 break-words">{notification.message}</CardDescription>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Badge className={notification.is_read ? "bg-surface-soft text-muted-foreground" : "bg-brand-soft text-brand"}>
                        {notification.is_read ? "Sudah Dibaca" : "Belum Dibaca"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {dateFormatter.format(new Date(notification.created_at))}
                  </p>
                </CardContent>

                {!notification.is_read && (
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                      <CheckCheckIcon data-icon="inline-start" aria-hidden="true" />
                      Tandai Sudah Dibaca
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </section>
        )
      )}
    </div>
  )
}
