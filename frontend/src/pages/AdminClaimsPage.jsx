import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { toast } from "sonner"

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  const fetchClaims = async () => {
    try {
      setLoading(true)
      const response = await api.get('/claims/')
      const claimsData = response.data?.data || response.data || []
      if (Array.isArray(claimsData)) setClaims(claimsData)
    } catch (err) {
      console.error("Error fetching claims:", err)
      toast.error("Gagal memuat daftar klaim.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClaims()
  }, [])

  const handleStatusUpdate = async (claimId, newStatus) => {
    try {
      await api.put(`/claims/${claimId}/status`, { status: newStatus })
      const statusLabel = {
        approved: "disetujui",
        rejected: "ditolak",
        completed: "diselesaikan",
        cancelled: "dibatalkan"
      }
      toast.success(`Klaim berhasil ${statusLabel[newStatus]}.`)
      fetchClaims()
    } catch (error) {
      console.error("Error updating claim:", error)
      const errorMsg = error.response?.data?.detail || "Gagal mengubah status klaim."
      toast.error(errorMsg)
    }
  }

  const filteredClaims = claims.filter(claim => {
    if (filter === "all") return true
    return claim.status === filter
  })

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Kelola Klaim</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Verifikasi dan kelola semua klaim barang temuan
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

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground animate-pulse">Memuat daftar klaim...</p>
        </div>
      ) : filteredClaims.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">
              {filter === "all" ? "Belum ada klaim yang masuk." : `Tidak ada klaim dengan status "${filter}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
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
                      <span className="block">Barang: <Link to={`/items/${claim.item_id}`} className="text-primary hover:underline">#{claim.item_id?.slice(0, 8)}</Link></span>
                      <span className="block">Pengklaim: {claim.user_id?.slice(0, 8)}</span>
                      <span className="block">{new Date(claim.created_at).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit' })}</span>
                    </CardDescription>
                  </div>
                  <StatusBadge type="claim" status={claim.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Jawaban Verifikasi:</p>
                  <p className="text-sm">{claim.ownership_answer}</p>
                </div>

                {claim.status === 'pending' && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button size="sm" onClick={() => handleStatusUpdate(claim.id, 'approved')}>
                      Setujui
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(claim.id, 'rejected')}>
                      Tolak
                    </Button>
                  </div>
                )}

                {claim.status === 'approved' && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button size="sm" onClick={() => handleStatusUpdate(claim.id, 'completed')}>
                      Tandai Selesai
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(claim.id, 'cancelled')}>
                      Batalkan
                    </Button>
                  </div>
                )}

                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/items/${claim.item_id}`}>Lihat Barang</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
