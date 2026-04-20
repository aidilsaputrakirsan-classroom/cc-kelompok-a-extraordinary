import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { MessageSquareQuoteIcon } from "lucide-react"

import { api } from "@/config/api"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import PageState from "@/components/PageState"

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMyClaims = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get("/claims/me")
      const claimsData = response.data?.data || response.data || []
      setClaims(Array.isArray(claimsData) ? claimsData : [])
    } catch (err) {
      console.error("Error fetching user claims:", err)
      setError(err.response?.data?.detail || "Gagal memuat klaim Anda.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyClaims()
  }, [])

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
            Riwayat Klaim
          </Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Pantau semua klaim yang pernah kamu ajukan.</h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Status klaim kini lebih mudah dipindai agar kamu bisa cepat tahu mana yang masih menunggu, mana yang disetujui, dan mana yang sudah selesai.
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

      {loading && <PageState state="loading" loadingText="Memuat daftar klaim Anda…" />}
      {!loading && error && <PageState state="error" errorText={error} onRetry={fetchMyClaims} />}

      {!loading && !error && claims.length === 0 ? (
        <Card className="border-brand/10 bg-surface-elevated/80">
          <CardHeader>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <MessageSquareQuoteIcon aria-hidden="true" />
            </div>
            <CardTitle>Belum Ada Klaim</CardTitle>
            <CardDescription>Begitu kamu mengajukan klaim pada barang temuan, seluruh progresnya akan tercatat di sini.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/items" className={buttonVariants()}>
              Jelajahi Barang Temuan
            </Link>
          </CardContent>
        </Card>
      ) : (
        !loading && !error && (
          <section className="grid gap-4">
            {claims.map((claim) => (
              <Card key={claim.id} className="bg-surface-elevated/80">
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="line-clamp-1 text-lg">
                        {claim.item_title || `Barang #${claim.item_id?.slice(0, 8)}`}
                      </CardTitle>
                      <CardDescription className="mt-2 break-all text-xs">
                        Klaim ID: {claim.id}
                      </CardDescription>
                    </div>
                    <StatusBadge type="claim" status={claim.status} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Jawaban Kepemilikan</p>
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{claim.ownership_answer}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Diajukan pada {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(claim.created_at))}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to={`/items/${claim.item_id}`} className={buttonVariants({ variant: "outline", className: "w-full md:w-fit" })}>
                    Lihat Barang
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
