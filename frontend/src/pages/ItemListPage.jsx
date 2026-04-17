import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchFilter } from "@/components/items/SearchFilter"
import { StatusBadge } from "@/components/ui/StatusBadge"
import PageState from "@/components/PageState"

export default function ItemListPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/items/')
      const itemsData = response.data?.data || response.data || []
      if (Array.isArray(itemsData)) {
        setItems(itemsData)
      } else {
        setItems([])
      }
    } catch (err) {
      console.error("Error fetching items:", err)
      setError(err.response?.data?.detail || "Gagal memuat daftar barang.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status === "all" || item.status === status
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Daftar Barang</h2>
        <Button asChild>
          <Link to="/items/create">Buat Laporan</Link>
        </Button>
      </div>

      <SearchFilter
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      {loading && <PageState state="loading" loadingText="Memuat daftar barang..." />}
      {!loading && error && <PageState state="error" errorText={error} onRetry={fetchItems} />}
      
      {!loading && !error && items.length === 0 && (
        <PageState state="empty" emptyText="Belum ada barang yang didata." />
      )}
      
      {!loading && !error && items.length > 0 && filteredItems.length === 0 && (
        <PageState state="empty" emptyText="Tidak ada barang yang sesuai dengan pencarian Anda." />
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
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
                {item.images && item.images.length > 0 && (
                  <div className="mt-4">
                    <img src={item.images[0].image_url || item.images[0].image_data} alt="Preview" className="w-full h-32 object-cover rounded-md border" />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" asChild>
                  <Link to={`/items/${item.id}`}>Lihat Detail</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
