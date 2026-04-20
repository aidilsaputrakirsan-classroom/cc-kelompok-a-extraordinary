import { Link } from "react-router-dom"
import { ArrowRightIcon, BellDotIcon, ClipboardCheckIcon, SearchCodeIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const highlights = [
  {
    title: "Pelaporan lebih jelas",
    description: "Form yang rapi, status mudah dibaca, dan alur klaim lebih mudah dipantau.",
  },
  {
    title: "Lebih siap untuk demo",
    description: "Layout baru dibuat agar flow penting lebih enak dipindai di desktop maupun mobile.",
  },
  {
    title: "Tetap satu alur data",
    description: "Semua refresh visual ini tetap mengikuti arsitektur frontend dan API yang sudah ada.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)] lg:items-stretch">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-brand/10 bg-surface-elevated/85 p-8 shadow-[0_24px_60px_-34px_rgba(83,40,190,0.35)] backdrop-blur md:p-10">
          <Badge variant="secondary" className="w-fit bg-brand-soft text-brand">
            Platform Resmi Lost & Found ITK
          </Badge>
          <div className="flex flex-col gap-4">
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Temuin membantu laporan barang hilang terasa <span className="text-brand">lebih cepat, lebih rapi, dan lebih meyakinkan</span>.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Laporkan barang hilang, umumkan temuan, pantau klaim, dan ikuti notifikasi penting dalam satu pengalaman yang lebih terang, lebih ramah, dan lebih mudah dipindai.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/items/create" className={buttonVariants({ size: "lg" })}>
              Buat Laporan
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Link>
            <Link to="/items" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Jelajahi Direktori Barang
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Card className="bg-gradient-to-br from-brand-soft via-white to-surface-soft">
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-[0_14px_28px_-16px_rgba(113,50,245,0.45)]">
                <SearchCodeIcon aria-hidden="true" />
              </div>
              <CardTitle>Direktori yang lebih mudah dipindai</CardTitle>
              <CardDescription>
                Fokus pada hierarchy visual, badge status, dan CTA yang lebih jelas sejak pertama kali masuk.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-white via-brand-soft/35 to-white">
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-info-soft text-info-foreground">
                <BellDotIcon aria-hidden="true" />
              </div>
              <CardTitle>Notifikasi dan progress lebih terbaca</CardTitle>
              <CardDescription>
                Halaman, state, dan kartu penting dibuat lebih komunikatif tanpa mengubah alur backend yang ada.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-white via-surface-soft to-brand-soft/35">
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-success-soft text-success-foreground">
                <ClipboardCheckIcon aria-hidden="true" />
              </div>
              <CardTitle>Eksperimen visual tetap aman</CardTitle>
              <CardDescription>
                Basis komponen, routing, auth, dan kontrak API tetap sama. Yang berubah adalah rasa UI dan kejelasan pengalaman.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title} className="bg-surface-elevated/80">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-1.5 w-16 rounded-full bg-brand/80" />
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
