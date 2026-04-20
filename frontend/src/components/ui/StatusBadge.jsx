import { Badge } from "@/components/ui/badge"

export function StatusBadge({ type, status, outline = false }) {
  const variantClass = (filled, outlined) => (outline ? outlined : filled)

  if (type === 'item') {
    switch (status) {
      case 'open':
        return <Badge variant={outline ? 'outline' : 'default'} className={variantClass("bg-success-soft text-success-foreground hover:bg-success-soft/80", "border-success/30 bg-success-soft/40 text-success-foreground")}>Tersedia</Badge>
      case 'in_claim':
        return <Badge variant={outline ? 'outline' : 'secondary'} className={variantClass("bg-warning-soft text-warning-foreground hover:bg-warning-soft/85", "border-warning/30 bg-warning-soft/45 text-warning-foreground")}>Sedang Diklaim</Badge>
      case 'returned':
        return <Badge variant={outline ? 'outline' : 'default'} className={variantClass("bg-info-soft text-info-foreground hover:bg-info-soft/85", "border-info/30 bg-info-soft/45 text-info-foreground")}>Dikembalikan</Badge>
      case 'closed':
        return <Badge variant="outline" className="border-border bg-surface-soft text-muted-foreground">Selesai</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (type === 'claim') {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-warning-soft text-warning-foreground hover:bg-warning-soft/85">Menunggu</Badge>
      case 'approved':
        return <Badge className="bg-info-soft text-info-foreground hover:bg-info-soft/85">Disetujui</Badge>
      case 'rejected':
        return <Badge variant="destructive">Ditolak</Badge>
      case 'completed':
        return <Badge className="bg-success-soft text-success-foreground hover:bg-success-soft/85">Selesai</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="border-border bg-surface-soft text-muted-foreground">Dibatalkan</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return <Badge variant="outline">{status}</Badge>
}
