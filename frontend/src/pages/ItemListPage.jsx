import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ItemListPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items')
        if (response.data && response.data.data) {
          setItems(response.data.data)
        }
      } catch (err) {
        console.error("API belum ada, menggunakan data mockup", err)
        setItems([
          { id: 1, type: "lost", title: "KTM a/n Budi", status: "open", description: "Jatuh di sekitar GSG" },
          { id: 2, type: "found", title: "Kunci Lemari Eiger", status: "open", description: "Ditemukan di kantin kampus, saya serahkan ke satpam" },
          { id: 3, type: "lost", title: "Botol Tupperware Hitam", status: "open", description: "Ketinggalan di G-201" }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Daftar Barang</h2>
        <Button asChild>
          <Link to="/items/create">Buat Laporan</Link>
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground animate-pulse">Memuat daftar barang...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center border rounded-lg bg-card">
          <p className="text-muted-foreground">Belum ada barang yang didata.</p>
        </div>
      ) : (
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
                <CardDescription>Status: <span className="font-medium capitalize">{item.status}</span></CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
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
