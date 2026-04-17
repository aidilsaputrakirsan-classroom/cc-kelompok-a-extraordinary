import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/StatusBadge"
import PageState from "@/components/PageState"

export default function MyItemsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMyItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/items/me')
      const itemsData = response.data?.data || response.data || []
      if (Array.isArray(itemsData)) {
        setItems(itemsData)
      } else {
        setItems([])
      }
    } catch (err) {
      console.error("Error fetching user items:", err)
      setError(err.response?.data?.detail || "Gagal memuat barang Anda.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyItems()
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Barang Saya</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Daftar semua laporan barang hilang atau temuan yang telah Anda buat
        </p>
      </div>

      {loading && <PageState state="loading" loadingText="Memuat daftar barang Anda..." />}
      {!loading && error && <PageState state="error" errorText={error} onRetry={fetchMyItems} />}

      {!loading && !error && items.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground mb-4">Anda belum membuat laporan apapun.</p>
            <Button asChild>
              <Link to="/items/create">Buat Laporan Pertama</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        !loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                    <Badge variant={item.type === 'lost' ? 'destructive' : 'default'} className="shrink-0">
                      {item.type === 'lost' ? 'Hilang' : 'Ditemukan'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    Status: <StatusBadge type="item" status={item.status} />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Dibuat: {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full" asChild>
                    <Link to={`/items/${item.id}`}>Lihat Detail</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
