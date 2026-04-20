import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { InboxIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react"

export default function PageState({ state, loadingText = "Memuat data...", emptyText = "Data kosong.", errorText = "Terjadi kesalahan.", onRetry }) {
  if (state === "loading") {
    return (
      <Card className="border-brand/10 bg-surface-elevated/80">
        <CardHeader className="gap-3">
          <div className="flex items-center gap-3 text-brand">
            <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
            <CardTitle className="text-base">{loadingText}</CardTitle>
          </div>
          <CardDescription>Tunggu sebentar, data sedang disiapkan.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-24 rounded-2xl bg-brand-soft/60" />
          <Skeleton className="h-24 rounded-2xl bg-muted" />
          <Skeleton className="h-24 rounded-2xl bg-surface-soft" />
        </CardContent>
      </Card>
    )
  }

  if (state === "error") {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader className="gap-3">
          <div className="flex items-center gap-3 text-destructive">
            <TriangleAlertIcon aria-hidden="true" />
            <CardTitle className="text-base">Terjadi Kendala</CardTitle>
          </div>
          <CardDescription className="text-foreground/80">{errorText}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 pb-6">
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Coba Lagi
            </Button>
          )}
          <p className="text-sm text-muted-foreground">Periksa koneksi atau ulangi beberapa saat lagi.</p>
        </CardContent>
      </Card>
    )
  }

  if (state === "empty") {
    return (
      <Card className="border-brand/10 bg-surface-elevated/80">
        <CardHeader className="items-start gap-3 text-left">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <InboxIcon aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">Belum Ada Data</CardTitle>
            <CardDescription>{emptyText}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="text-sm text-muted-foreground">Coba ubah filter, buat data baru, atau kembali lagi nanti.</p>
        </CardContent>
      </Card>
    )
  }

  return null
}
