import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchFilter({ search, status, onSearchChange, onStatusChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_220px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="item-search">Cari Barang</Label>
        <Input
          id="item-search"
          name="item-search"
          aria-label="Cari barang"
          placeholder="Cari nama barang…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="item-status-filter">Filter Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="item-status-filter" aria-label="Filter status barang">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="open">Tersedia</SelectItem>
            <SelectItem value="in_claim">Sedang Diklaim</SelectItem>
            <SelectItem value="returned">Dikembalikan</SelectItem>
            <SelectItem value="closed">Selesai</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
