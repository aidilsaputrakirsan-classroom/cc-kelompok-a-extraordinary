import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`)
        if (response.data) setItem(response.data)
      } catch (err) {
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
          <Badge variant="outline" className="capitalize">{item.status}</Badge>
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
          <div className="pt-6">
            <Button size="lg" className="w-full sm:w-auto">
              Ajukan Klaim Barang Ini
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
