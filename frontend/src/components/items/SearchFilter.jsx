import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchFilter({ search, status, onSearchChange, onStatusChange }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Input 
        placeholder="Cari nama barang..." 
        value={search} 
        onChange={(e) => onSearchChange(e.target.value)} 
        className="w-full sm:max-w-xs"
      />
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="open">Tersedia (Open)</SelectItem>
          <SelectItem value="in_claim">Sedang Diklaim</SelectItem>
          <SelectItem value="returned">Dikembalikan</SelectItem>
          <SelectItem value="closed">Selesai</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
