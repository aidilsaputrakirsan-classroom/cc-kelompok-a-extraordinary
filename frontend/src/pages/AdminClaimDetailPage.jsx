import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { api } from "@/config/api"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { StatusBadge } from "@/components/ui/StatusBadge"
import PageState from "@/components/PageState"
import { toast } from "sonner"

export default function AdminClaimDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [claim, setClaim] = useState(null)
  const [item, setItem] = useState(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [updating, setUpdating] = useState(false)

  const fetchData = async (signal) => {
    try {
      setLoading(true)
      setError(null)
      
      const claimRes = await api.get(`/api/claims/${id}`, { signal })
      const claimData = claimRes.data?.data || claimRes.data
      setClaim(claimData)

      if (claimData?.item_id) {
        try {
          const itemRes = await api.get(`/api/items/${claimData.item_id}`, { signal })
          setItem(itemRes.data?.data || itemRes.data)
        } catch (itemErr) {
          if (itemErr.name === 'CanceledError' || itemErr.code === 'ERR_CANCELED') throw itemErr;
          console.error("Error fetching item:", itemErr)
          // Tidak memblokir jika item gagal diambil
        }
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
      console.error("Error fetching claim details:", err)
      setError("Gagal memuat detail klaim. " + (err.response?.data?.detail || ""))
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true)
      setActionError(null)
      await api.put(`/api/claims/${id}/status`, { status: newStatus })
      
      const statusLabel = {
        approved: "disetujui",
        rejected: "ditolak",
        completed: "diselesaikan",
        cancelled: "dibatalkan"
      }
      toast.success(`Klaim berhasil ${statusLabel[newStatus]}.`)
      
      // Refresh data
      await fetchData()
    } catch (error) {
      console.error("Error updating claim:", error)
      const errorMsg = error.response?.data?.detail || "Gagal mengubah status klaim."
      setActionError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <PageState state="loading" loadingText="Memuat detail klaim..." />
  if (error) return <PageState state="error" errorText={error} onRetry={() => fetchData()} />
  if (!claim) return <PageState state="empty" emptyText="Klaim tidak ditemukan." />

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Kembali
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Detail Klaim #{claim.id?.slice(0, 8)}</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Informasi Klaim</CardTitle>
              <CardDescription>Detail verifikasi kepemilikan barang</CardDescription>
            </div>
            <StatusBadge type="claim" status={claim.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">ID Klaim</p>
              <p className="font-medium">{claim.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">ID User (Pengklaim)</p>
              <p className="font-medium">{claim.user_id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Waktu Dibuat</p>
              <p className="font-medium">{new Date(claim.created_at).toLocaleString("id-ID")}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Jawaban Verifikasi (Ownership Answer):</h3>
            <div className="p-4 bg-muted/50 rounded-md text-sm whitespace-pre-wrap">
              {claim.ownership_answer || "Tidak ada jawaban"}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3 border-t pt-6">
          {actionError && (
            <Alert variant="destructive" className="basis-full">
              <AlertTitle>Gagal memperbarui status</AlertTitle>
              <AlertDescription>{actionError}</AlertDescription>
            </Alert>
          )}

          {claim.status === 'pending' && (
            <>
              <Button 
                onClick={() => handleStatusUpdate('approved')} 
                disabled={updating}
              >
                {updating ? "Memproses..." : "Setujui Klaim"}
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleStatusUpdate('rejected')}
                disabled={updating}
              >
                {updating ? "Memproses..." : "Tolak Klaim"}
              </Button>
            </>
          )}

          {claim.status === 'approved' && (
            <>
              <Button 
                onClick={() => handleStatusUpdate('completed')}
                disabled={updating}
              >
                {updating ? "Memproses..." : "Tandai Selesai (Diserahkan)"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={updating}
              >
                {updating ? "Memproses..." : "Batalkan Persetujuan"}
              </Button>
            </>
          )}

          {(claim.status === 'rejected' || claim.status === 'cancelled' || claim.status === 'completed') && (
            <p className="text-sm text-muted-foreground">
              Status klaim saat ini adalah final atau sedang tidak bisa diubah langsung dari UI ini.
            </p>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Barang</CardTitle>
        </CardHeader>
        <CardContent>
          {item ? (
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> <Link to={`/items/${item.id}`} className="text-primary hover:underline">{item.id}</Link></p>
              <p><strong>Judul:</strong> {item.title}</p>
              <p><strong>Tipe:</strong> {item.type === 'found' ? 'Barang Temuan' : 'Barang Hilang'}</p>
              <p><strong>Deskripsi:</strong> {item.description}</p>
              <Link to={`/items/${item.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}>
                Lihat Halaman Barang
              </Link>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <p>ID Barang: {claim.item_id}</p>
              <p>Data barang tidak dapat dimuat secara lengkap.</p>
              <Link to={`/items/${claim.item_id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}>
                Coba Lihat Halaman Barang
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
