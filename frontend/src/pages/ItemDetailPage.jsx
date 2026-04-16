import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClaimForm } from "@/components/items/ClaimForm"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { toast } from "sonner"

export default function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}/`)
        // Handle both response.data.data and response.data directly
        const itemData = response.data?.data || response.data
        if (itemData) setItem(itemData)
      } catch (err) {
        console.error("Error fetching item:", err)
        // Mock fallback data for development
        setItem({
          id,
          type: "found",
          title: "Kunci Lemari Eiger (Mock)",
          status: "open",
          description: "Ditemukan di meja kantin utara. Sudah saya amankan dan titipkan ke post satpam depan.",
          contact: "-",
          created_at: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  const handleClaimSubmit = async (claimData) => {
    try {
      setClaimLoading(true)
      const response = await api.post('/claims/', claimData)
      if (response.status === 201 || response.status === 200) {
        toast.success("Klaim berhasil diajukan! Admin akan segera memverifikasi.")
        setShowClaimForm(false)
        // Refresh item data
        try {
          const updatedItem = await api.get(`/items/${id}/`)
          if (updatedItem.data) setItem(updatedItem.data)
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

        <div>
          <h3 className="mb-2 text-lg font-semibold">Kontak Informasi</h3>
          <p className="text-muted-foreground">{item.contact || "Tidak disertakan"}</p>
        </div>

        {item.type === 'found' && item.status === 'open' && (
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
      </div>
    </div>
  )
}
