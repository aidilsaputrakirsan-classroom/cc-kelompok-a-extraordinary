import { Badge } from "@/components/ui/badge"

export function StatusBadge({ type, status, outline = false }) {
  if (type === 'item') {
    switch (status) {
      case 'open':
        return <Badge variant={outline ? 'outline' : 'default'} className="bg-green-600 hover:bg-green-700">Tersedia</Badge>
      case 'in_claim':
        return <Badge variant={outline ? 'outline' : 'secondary'} className="bg-yellow-500 hover:bg-yellow-600 text-white">Sedang Diklaim</Badge>
      case 'returned':
        return <Badge variant={outline ? 'outline' : 'outline'} className="text-blue-600 border-blue-600">Dikembalikan</Badge>
      case 'closed':
        return <Badge variant="outline" className="text-gray-500">Selesai</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (type === 'claim') {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">Menunggu</Badge>
      case 'approved':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Disetujui</Badge>
      case 'rejected':
        return <Badge variant="destructive">Ditolak</Badge>
      case 'completed':
        return <Badge className="bg-green-600 hover:bg-green-700">Selesai</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="text-gray-500">Dibatalkan</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return <Badge variant="outline">{status}</Badge>
}
