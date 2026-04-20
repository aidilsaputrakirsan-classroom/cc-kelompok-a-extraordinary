import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { api } from "@/config/api"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/StatusBadge"
import PageState from "@/components/PageState"

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")

  const fetchClaims = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get("/claims/")
      const claimsData = response.data?.data || response.data || []
      setClaims(Array.isArray(claimsData) ? claimsData : [])
    } catch (err) {
      console.error("Error fetching claims:", err)
      setError(`Gagal memuat daftar klaim. ${err.response?.data?.detail || ""}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClaims()
  }, [])

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => filter === "all" || claim.status === filter)
  }, [claims, filter])

  const summary = useMemo(() => [
    { label: "Total Klaim", value: claims.length, tone: "bg-brand-soft text-brand" },
    { label: "Menunggu", value: claims.filter((claim) => claim.status === "pending").length, tone: "bg-warning-soft text-warning-foreground" },
    { label: "Selesai", value: claims.filter((claim) => claim.status === "completed").length, tone: "bg-success-soft text-success-foreground" },
  ], [claims])

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section className="rounded-[2rem] border border-brand/10 bg-surface-elevated/85 p-6 shadow-[0_22px_60px_-34px_rgba(83,40,190,0.32)] backdrop-blur md:p-8">
        <div className="flex flex-col gap-3">
          <Badge variant="secondary" className="w-fit bg-brand-soft text-brand">
            Workspace Admin
          </Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Kelola semua klaim dengan tampilan yang lebih terstruktur.</h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Halaman admin sengaja dibuat sedikit lebih rapat dan presisi agar verifikasi klaim, pencarian status, dan tindak lanjut item bisa diproses lebih efisien.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {summary.map((item) => (
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
          <CardTitle>Filter Klaim</CardTitle>
          <CardDescription>Pilih status tertentu untuk mempersempit daftar klaim yang perlu diperiksa.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="md:max-w-[220px]" aria-label="Filter status klaim">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">{filteredClaims.length} klaim ditemukan</p>
        </CardContent>
      </Card>

      {loading && <PageState state="loading" loadingText="Memuat daftar klaim…" />}
      {!loading && error && <PageState state="error" errorText={error} onRetry={fetchClaims} />}

      {!loading && !error && filteredClaims.length === 0 && (
        <PageState
          state="empty"
          emptyText={filter === "all" ? "Belum ada klaim yang masuk." : `Tidak ada klaim dengan status \"${filter}\".`}
        />
      )}

      {!loading && !error && filteredClaims.length > 0 && (
        <section className="grid gap-4">
          {filteredClaims.map((claim) => (
            <Card key={claim.id} className="bg-surface-elevated/80">
              <CardHeader>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <CardTitle>Klaim #{claim.id?.slice(0, 8)}</CardTitle>
                      <StatusBadge type="claim" status={claim.status} />
                    </div>
                    <CardDescription className="mt-3 flex flex-col gap-1 md:flex-row md:flex-wrap md:gap-4">
                      <span>Barang: #{claim.item_id?.slice(0, 8)}</span>
                      <span>User: {claim.user_id?.slice(0, 8)}</span>
                    </CardDescription>
                  </div>
                  <Link to={`/admin/claims/${claim.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Lihat Detail
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </section>
      )}
    </div>
  )
}
