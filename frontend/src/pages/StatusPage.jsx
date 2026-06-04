import { useCallback, useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { api } from "@/config/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const POLLING_INTERVAL_MS = 30000

const normalizeStatus = (status) => {
  const value = String(status || "").toLowerCase()
  if (["up", "healthy", "ok"].includes(value)) return "up"
  if (["degraded", "partial"].includes(value)) return "degraded"
  return "down"
}

const statusLabel = {
  up: "up",
  degraded: "degraded",
  down: "down",
}

const serviceLabel = {
  auth: "Auth Service",
  item: "Item Service",
  items: "Item Service",
  engagement: "Engagement Service",
}

function StatusBadge({ status, name }) {
  const normalized = normalizeStatus(status)
  const variant = normalized === "down" ? "destructive" : "success"

  return (
    <Badge
      variant={variant}
      aria-label={`${name} ${statusLabel[normalized]}`}
    >
      {statusLabel[normalized]}
    </Badge>
  )
}

function StatusSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <Card key={item}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function StatusPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchStatus = useCallback(async (signal) => {
    try {
      setError(null)
      const response = await api.get("/api/status", { signal })
      const statusData = response.data?.services || []
      setServices(Array.isArray(statusData) ? statusData : [])
      setLastUpdated(new Date())
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return
      setError("Gagal memuat status layanan.")
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchStatus(controller.signal)

    const interval = window.setInterval(() => {
      const pollingController = new AbortController()
      fetchStatus(pollingController.signal)
    }, POLLING_INTERVAL_MS)

    return () => {
      controller.abort()
      window.clearInterval(interval)
    }
  }, [fetchStatus])

  const handleRefresh = () => {
    setLoading(true)
    fetchStatus()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Status Layanan</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Monitoring kesehatan service Temuin.
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw data-icon="inline-start" />
            Refresh
          </Button>
        </header>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Status belum tersedia</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <section role="status" aria-live="polite" className="flex flex-col gap-4">
          {loading && services.length === 0 ? (
            <StatusSkeleton />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {services.map((service) => {
                const name = serviceLabel[service.name] || service.name
                return (
                  <Card key={service.name}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle>{name}</CardTitle>
                          <CardDescription>{service.name}</CardDescription>
                        </div>
                        <StatusBadge status={service.status} name={name} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Latensi: {service.latency_ms ?? "-"} ms
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Terakhir diperbarui {lastUpdated.toLocaleTimeString("id-ID")}. Polling setiap 30 detik.
          </p>
        )}
      </div>
    </main>
  )
}
