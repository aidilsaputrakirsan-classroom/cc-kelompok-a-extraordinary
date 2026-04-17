import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { api } from "@/config/api"
import { useAuth } from "@/app/providers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClaimForm } from "@/components/items/ClaimForm"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { toast } from "sonner"

export default function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)

  const isAdmin = user?.role === "admin" || user?.role === "superadmin"
  const isOwner = item?.created_by === user?.id

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`)
        const itemData = response.data?.data || response.data
        if (itemData) setItem(itemData)
      } catch (err) {
        console.error("Error fetching item:", err)
        toast.error("Gagal memuat detail barang.")
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  // Fetch claims for this item if user is owner or admin
  useEffect(() => {
    if (!item || (!isOwner && !isAdmin)) return
    const fetchClaims = async () => {
      try {
        const response = await api.get(`/claims/?item_id=${item.id}`)
        const claimsData = response.data?.data || response.data || []
        if (Array.isArray(claimsData)) setClaims(claimsData)
      } catch (err) {
        console.error("Error fetching claims:", err)
      }
    }
    fetchClaims()
  }, [item, isOwner, isAdmin])

  const handleClaimSubmit = async (claimData) => {
    try {
      setClaimLoading(true)
      const response = await api.post('/claims/', claimData)
      if (response.status === 201 || response.status === 200) {
        toast.success("Klaim berhasil diajukan! Admin akan segera memverifikasi.")
        setShowClaimForm(false)
        // Refresh item data
        try {
          const updatedItem = await api.get(`/items/${id}`)
          const itemData = updatedItem.data?.data || updatedItem.data
          if (itemData) setItem(itemData)
        } catch (refreshError) {
          console.error("Error refreshing item:", refreshError)
        }
      }
    } catch (error) {
      console.error("Error submitting claim:", error)
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Gagal mengajukan klaim. Silakan coba lagi."
      toast.error(errorMsg)
    } finally {
      setClaimLoading(false)
    }
  }

  const handleClaimStatusUpdate = async (claimId, newStatus) => {
    try {
      await api.put(`/claims/${claimId}/status`, { status: newStatus })
      toast.success(`Klaim berhasil di-${newStatus === 'approved' ? 'setujui' : newStatus === 'rejected' ? 'tolak' : newStatus === 'completed' ? 'selesaikan' : 'batalkan'}.`)
      // Refresh item and claims
      const [itemRes, claimsRes] = await Promise.all([
        api.get(`/items/${id}`),
        api.get(`/claims/?item_id=${id}`)
      ])
      const itemData = itemRes.data?.data || itemRes.data
      if (itemData) setItem(itemData)
      const claimsData = claimsRes.data?.data || claimsRes.data || []
      if (Array.isArray(claimsData)) setClaims(claimsData)
    } catch (error) {
      console.error("Error updating claim status:", error)
      const errorMsg = error.response?.data?.detail || "Gagal mengubah status klaim."
      toast.error(errorMsg)
    }
  }

  if (loading) return <div className="py-20 text-center"><p className="animate-pulse">Sedang mengambil detail barang...</p></div>
  if (!item) return <div className="py-20 text-center font-semibold">Barang tidak ditemukan.</div>

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        Kembali
      </Button>

      <div className="flex flex-col gap-4 pb-6 border-b sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">{item.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dilaporkan pada {new Date(item.created_at).toLocaleDateString("id-ID")}
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
        <div>
          <h3 className="mb-2 text-lg font-semibold">Keterangan / Deskripsi</h3>
          <p className="leading-relaxed text-muted-foreground">{item.description}</p>
        </div>

        {/* Images */}
        {item.images && item.images.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-semibold">Foto</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {item.images.map((img, idx) => (
                <img
                  key={img.id || idx}
                  src={img.image_data}
                  alt={`Foto ${idx + 1}`}
                  className="object-cover w-full h-32 rounded-md border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Claim button for non-owner users on found+open items */}
        {item.type === 'found' && item.status === 'open' && !isOwner && (
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

        {item.status === 'in_claim' && !isOwner && !isAdmin && (
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

        {/* Claims section for item owner or admin */}
        {(isOwner || isAdmin) && claims.length > 0 && (
          <div className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold">Daftar Klaim ({claims.length})</h3>
            {claims.map((claim) => (
              <Card key={claim.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base">Klaim oleh User #{claim.user_id?.slice(0, 8)}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(claim.created_at).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                      </p>
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
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleClaimStatusUpdate(claim.id, 'approved')}
                      >
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleClaimStatusUpdate(claim.id, 'rejected')}
                      >
                        Tolak
                      </Button>
                    </div>
                  )}
                  {claim.status === 'approved' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleClaimStatusUpdate(claim.id, 'completed')}
                      >
                        Tandai Selesai (Barang Dikembalikan)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleClaimStatusUpdate(claim.id, 'cancelled')}
                      >
                        Batalkan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
