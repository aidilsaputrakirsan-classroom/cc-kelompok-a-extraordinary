import { Link } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"

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
        <Link to="/items/create" className={buttonVariants({ size: "lg" })}>
          Buat Laporan
        </Link>
        <Link to="/items" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Lihat Direktori Barang
        </Link>
      </div>
    </div>
  )
}
