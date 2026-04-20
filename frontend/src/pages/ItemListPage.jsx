import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { FolderSearch2Icon, SearchSlashIcon } from "lucide-react"

import { api } from "@/config/api"
import { buttonVariants } from "@/components/ui/button"
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
      const response = await api.get("/items/")
      const itemsData = response.data?.data || response.data || []
      setItems(Array.isArray(itemsData) ? itemsData : [])
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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === "all" || item.status === status
      return matchesSearch && matchesStatus
    })
  }, [items, search, status])

  const statusSummary = useMemo(() => {
    return [
      { label: "Total Barang", value: items.length, tone: "bg-brand-soft text-brand" },
      { label: "Masih Tersedia", value: items.filter((item) => item.status === "open").length, tone: "bg-success-soft text-success-foreground" },
      { label: "Sedang Diklaim", value: items.filter((item) => item.status === "in_claim").length, tone: "bg-warning-soft text-warning-foreground" },
    ]
  }, [items])

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section className="rounded-[2rem] border border-brand/10 bg-surface-elevated/85 p-6 shadow-[0_22px_60px_-34px_rgba(83,40,190,0.32)] backdrop-blur md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <Badge variant="secondary" className="w-fit bg-brand-soft text-brand">
              Direktori Barang ITK
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Cari laporan yang paling relevan dengan cepat.</h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Gunakan pencarian dan status untuk memindai barang hilang maupun barang temuan dengan lebih nyaman, tanpa harus menyaring satu per satu secara manual.
            </p>
          </div>
          <Link to="/items/create" className={buttonVariants({ size: "lg" })}>
            Buat Laporan
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {statusSummary.map((item) => (
          <Card key={item.label} className="bg-surface-elevated/75">
            <CardHeader className="gap-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold tracking-tight">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={item.tone}>{item.label}</Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="bg-surface-elevated/80">
        <CardHeader>
          <CardTitle>Filter Cepat</CardTitle>
          <CardDescription>Persempit daftar barang berdasarkan nama dan status terbaru.</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchFilter
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />
        </CardContent>
      </Card>

      {loading && <PageState state="loading" loadingText="Memuat daftar barang…" />}
      {!loading && error && <PageState state="error" errorText={error} onRetry={fetchItems} />}
      {!loading && !error && items.length === 0 && <PageState state="empty" emptyText="Belum ada barang yang didata." />}

      {!loading && !error && items.length > 0 && filteredItems.length === 0 && (
        <Card className="border-brand/10 bg-surface-elevated/80">
          <CardHeader>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <SearchSlashIcon aria-hidden="true" />
            </div>
            <CardTitle>Tidak Ada Hasil yang Cocok</CardTitle>
            <CardDescription>Coba ganti kata kunci atau pilih status lain agar hasil yang muncul lebih luas.</CardDescription>
          </CardHeader>
        </Card>
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="flex h-full flex-col bg-surface-elevated/80">
              {item.images && item.images.length > 0 ? (
                <div className="aspect-[16/10] overflow-hidden border-b border-border/70">
                  <img
                    src={item.images[0].image_data}
                    alt={`Preview ${item.title}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center border-b border-dashed border-border/80 bg-surface-soft text-muted-foreground">
                  <FolderSearch2Icon aria-hidden="true" />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">{item.description || "Belum ada deskripsi tambahan."}</CardDescription>
                  </div>
                  <Badge variant={item.type === "lost" ? "outline" : "default"} className={item.type === "lost" ? "border-brand/20 bg-background/80 text-foreground" : "bg-brand-soft text-brand"}>
                    {item.type === "lost" ? "Hilang" : "Ditemukan"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Status</span>
                  <StatusBadge type="item" status={item.status} />
                </div>
              </CardContent>

              <CardFooter>
                <Link to={`/items/${item.id}`} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  Lihat Detail
                </Link>
              </CardFooter>
            </Card>
          ))}
        </section>
      )}
    </div>
  )
}
