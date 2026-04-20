import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ClipboardListIcon } from "lucide-react"

import { api } from "@/config/api"
import { buttonVariants } from "@/components/ui/button"
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
      const response = await api.get("/items/me")
      const itemsData = response.data?.data || response.data || []
      setItems(Array.isArray(itemsData) ? itemsData : [])
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

  const summaries = useMemo(() => {
    return [
      { label: "Total Laporan", value: items.length, tone: "bg-brand-soft text-brand" },
      { label: "Masih Aktif", value: items.filter((item) => item.status === "open").length, tone: "bg-success-soft text-success-foreground" },
      { label: "Sudah Dikembalikan", value: items.filter((item) => item.status === "returned").length, tone: "bg-info-soft text-info-foreground" },
    ]
  }, [items])

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section className="rounded-[2rem] border border-brand/10 bg-surface-elevated/85 p-6 shadow-[0_22px_60px_-34px_rgba(83,40,190,0.32)] backdrop-blur md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <Badge variant="secondary" className="w-fit bg-brand-soft text-brand">
              Riwayat Laporan Pribadi
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Pantau semua barang yang sudah pernah kamu laporkan.</h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Halaman ini merangkum status laporanmu dengan lebih rapi, supaya kamu bisa langsung tahu mana yang masih aktif dan mana yang sudah selesai.
            </p>
          </div>
          <Link to="/items/create" className={buttonVariants({ size: "lg" })}>
            Buat Laporan Baru
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {summaries.map((item) => (
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

      {loading && <PageState state="loading" loadingText="Memuat daftar barang Anda…" />}
      {!loading && error && <PageState state="error" errorText={error} onRetry={fetchMyItems} />}

      {!loading && !error && items.length === 0 ? (
        <Card className="border-brand/10 bg-surface-elevated/80">
          <CardHeader>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <ClipboardListIcon aria-hidden="true" />
            </div>
            <CardTitle>Belum Ada Laporan</CardTitle>
            <CardDescription>Setelah kamu membuat laporan pertama, seluruh riwayatnya akan muncul di sini.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/items/create" className={buttonVariants()}>
              Buat Laporan Pertama
            </Link>
          </CardContent>
        </Card>
      ) : (
        !loading && !error && (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="flex h-full flex-col bg-surface-elevated/80">
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
                  <p className="text-sm text-muted-foreground">
                    Dibuat pada {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.created_at))}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to={`/items/${item.id}`} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                    Lihat Detail
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </section>
        )
      )}
    </div>
  )
}
