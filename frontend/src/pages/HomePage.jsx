import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-8 py-12 text-center md:py-24">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        <span className="text-primary">Temuin</span>
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Platform resmi untuk melaporkan barang hilang dan mengumumkan penemuan barang di lingkungan Institut Teknologi Kalimantan.
      </p>
      <div className="flex flex-col w-full gap-4 sm:w-auto sm:flex-row">
        <Button size="lg" asChild>
          <Link to="/items/create">Buat Laporan</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/items">Lihat Direktori Barang</Link>
        </Button>
      </div>
    </div>
  )
}
