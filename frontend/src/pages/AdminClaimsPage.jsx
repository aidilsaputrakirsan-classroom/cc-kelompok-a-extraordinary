import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/StatusBadge"
import PageState from "@/components/PageState"

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")

  const fetchClaims = async () => {
    try {
      setLoading(true)
      setError(null)
      // Gunakan trailing slash
      const response = await api.get('/claims/')
      const claimsData = response.data?.data || response.data || []
      if (Array.isArray(claimsData)) {
        setClaims(claimsData)
      } else {
        setClaims([])
      }
    } catch (err) {
      console.error("Error fetching claims:", err)
      setError("Gagal memuat daftar klaim. " + (err.response?.data?.detail || ""))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClaims()
  }, [])

  const filteredClaims = claims.filter(claim => {
    if (filter === "all") return true
    return claim.status === filter
  })

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Kelola Klaim</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Daftar klaim dari user yang membutuhkan verifikasi admin.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="approved">Disetujui</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {filteredClaims.length} klaim ditemukan
        </p>
      </div>

      {loading && <PageState state="loading" loadingText="Memuat daftar klaim..." />}
      {!loading && error && <PageState state="error" errorText={error} onRetry={fetchClaims} />}
      
      {!loading && !error && filteredClaims.length === 0 && (
        <PageState 
          state="empty" 
          emptyText={filter === "all" ? "Belum ada klaim yang masuk." : `Tidak ada klaim dengan status "${filter}".`} 
        />
      )}

      {!loading && !error && filteredClaims.length > 0 && (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <Card key={claim.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      Klaim #{claim.id?.slice(0, 8)}
                    </CardTitle>
                    <CardDescription className="mt-1 space-y-1">
                      <span className="block">Barang: #{claim.item_id?.slice(0, 8)}</span>
                      <span className="block">User: {claim.user_id?.slice(0, 8)}</span>
                    </CardDescription>
                  </div>
                  <StatusBadge type="claim" status={claim.status} />
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/admin/claims/${claim.id}`}>Lihat Detail</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
