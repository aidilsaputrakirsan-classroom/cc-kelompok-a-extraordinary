import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { api } from "@/config/api"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClaimForm } from "@/components/items/ClaimForm"
import { StatusBadge } from "@/components/ui/StatusBadge"
import PageState from "@/components/PageState"
import { useAuth } from "@/app/providers"
import { toast } from "sonner"
import { EditItemDialog } from "@/components/items/EditItemDialog"
import { Pencil, Trash2 } from "lucide-react"

export default function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)
  
  const [claims, setClaims] = useState([])
  const [claimsLoading, setClaimsLoading] = useState(false)

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)

  const fetchItemAndClaims = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/items/${id}`)
      const itemData = response.data?.data || response.data
      setItem(itemData)

      // Fetch claims jika admin atau owner
      if (itemData && user && (user.role === 'admin' || user.role === 'superadmin' || user.id === itemData.created_by)) {
        fetchClaims(itemData.id)
      }
    } catch (err) {
      console.error("Error fetching item:", err)
      setError(err.response?.data?.detail || "Gagal memuat detail barang.")
    } finally {
      setLoading(false)
    }
  }

  const fetchClaims = async (itemId) => {
    try {
      setClaimsLoading(true)
      const res = await api.get(`/claims/?item_id=${itemId}`)
      const itemClaims = res.data?.data || res.data || []
      setClaims(itemClaims)
    } catch (err) {
      console.error("Error fetching claims for item:", err)
    } finally {
      setClaimsLoading(false)
    }
  }

  useEffect(() => {
    fetchItemAndClaims()
  }, [id, user])

  const handleClaimSubmit = async (claimData) => {
    try {
      setClaimLoading(true)
      const response = await api.post('/claims/', claimData)
      if (response.status === 201 || response.status === 200) {
        toast.success("Klaim berhasil diajukan! Admin akan segera memverifikasi.")
        setShowClaimForm(false)
        fetchItemAndClaims() // Refresh
      }
    } catch (error) {
      console.error("Error submitting claim:", error)
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Gagal mengajukan klaim. Silakan coba lagi."
      toast.error(errorMsg)
    } finally {
      setClaimLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus laporan ini?")) return

    try {
      setDeleteLoading(true)
      await api.delete(`/items/${item.id}`)
      toast.success("Laporan berhasil dihapus!")
      navigate("/my-items")
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Gagal menghapus laporan.")
      setDeleteLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    try {
      setStatusUpdateLoading(true)
      await api.put(`/items/${item.id}`, { status: newStatus })
      toast.success("Status berhasil diperbarui!")
      fetchItemAndClaims()
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Gagal memperbarui status.")
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  if (loading) return <PageState state="loading" loadingText="Memuat detail barang..." />
  if (error) return <PageState state="error" errorText={error} onRetry={fetchItemAndClaims} />
  if (!item) return <PageState state="empty" emptyText="Barang tidak ditemukan." />

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'
  const isOwner = user?.id === item.created_by
  const canCloseItem = isAdmin && ['open', 'in_claim', 'returned'].includes(item.status)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Kembali
        </Button>
        {isOwner && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteLoading}>
              <Trash2 className="w-4 h-4 mr-2" />
              {deleteLoading ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 pb-6 border-b sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">{item.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dilaporkan pada {new Date(item.created_at).toLocaleDateString("id-ID")}
            {item.created_by && ` oleh User #${item.created_by.slice(0, 8)}`}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
          <Badge variant={item.type === 'lost' ? 'destructive' : 'default'} className="px-3 py-1">
            {item.type === 'lost' ? 'Laporan Kehilangan' : 'Barang Temuan'}
          </Badge>
          <StatusBadge type="item" status={item.status} />
        </div>
      </div>

      <div className="space-y-6">
        {item.images && item.images.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-semibold">Foto Barang</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {item.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img.image_data} 
                  alt={`Foto ${idx+1}`} 
                  className="object-cover w-full h-32 rounded-md border" 
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-lg font-semibold">Keterangan / Deskripsi</h3>
          <p className="leading-relaxed text-muted-foreground">{item.description}</p>
        </div>

        {isAdmin && item.status !== 'closed' && (
          <div className="pt-6 space-y-4 border-t">
            <h3 className="text-lg font-semibold">Aksi Admin</h3>
            <div className="flex flex-wrap gap-2">
              {item.status === 'open' && (
                <Button 
                  variant="outline" 
                  onClick={() => handleUpdateStatus('returned')}
                  disabled={statusUpdateLoading}
                >
                  Tandai Dikembalikan
                </Button>
              )}
              {canCloseItem && (
                <Button 
                  variant="outline" 
                  onClick={() => handleUpdateStatus('closed')}
                  disabled={statusUpdateLoading}
                >
                  Tutup Laporan
                </Button>
              )}
            </div>
          </div>
        )}

        {item.type === 'found' && item.status === 'open' && !isOwner && !isAdmin && (
          <div className="pt-6 space-y-4">
            {!showClaimForm && (
              <Button size="lg" className="w-full sm:w-auto" onClick={() => setShowClaimForm(true)}>
                Ajukan Klaim Barang Ini
              </Button>
            )}
            {showClaimForm && (
              <ClaimForm
                itemId={item.id}
                itemTitle={item.title}
                onSubmit={handleClaimSubmit}
                loading={claimLoading}
              />
            )}
          </div>
        )}

        {item.status === 'in_claim' && (
          <div className="pt-6 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <p className="text-sm text-yellow-800">
              Barang ini sedang dalam proses klaim. Silakan tunggu verifikasi dari admin.
            </p>
          </div>
        )}

        {item.status === 'returned' && (
          <div className="pt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-800">
              Barang ini telah dikembalikan kepada pemiliknya.
            </p>
          </div>
        )}

        {(isAdmin || isOwner) && claims.length > 0 && (
          <div className="pt-6">
            <h3 className="mb-4 text-lg font-semibold">Daftar Klaim Terkait</h3>
            <div className="space-y-4">
              {claims.map((claim) => (
                <Card key={claim.id}>
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Klaim #{claim.id.slice(0, 8)}</CardTitle>
                      <StatusBadge type="claim" status={claim.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="py-2 text-sm">
                    <p className="text-muted-foreground mb-2">Oleh User: {claim.user_id}</p>
                    <p className="font-medium">Jawaban:</p>
                    <p className="whitespace-pre-wrap">{claim.ownership_answer}</p>
                    {isAdmin && (
                      <Link to={`/admin/claims/${claim.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}>
                        Lihat Detail Klaim
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {showEditDialog && (
        <EditItemDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          item={item}
          onSuccess={() => {
            toast.success("Laporan berhasil diperbarui!")
            setShowEditDialog(false)
            fetchItemAndClaims()
          }}
        />
      )}
    </div>
  )
}
