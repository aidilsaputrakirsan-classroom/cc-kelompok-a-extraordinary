import { useState, useEffect } from "react"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

const ENTITY_TYPES = [
  { key: "categories", label: "Kategori", singular: "Kategori" },
  { key: "buildings", label: "Gedung", singular: "Gedung" },
  { key: "locations", label: "Lokasi", singular: "Lokasi" },
  { key: "security-officers", label: "Satpam", singular: "Satpam" },
]

function MasterDataTable({ entityType, label, singular }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/master-data/${entityType}`)
      const data = response.data?.data || response.data || []
      if (Array.isArray(data)) setItems(data)
    } catch (err) {
      console.error(`Error fetching ${entityType}:`, err)
      toast.error(`Gagal memuat data ${label.toLowerCase()}.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [entityType])

  const openCreate = () => {
    setEditItem(null)
    setName("")
    setDialogOpen(true)
  }

  const openEdit = (item) => {
    setEditItem(item)
    setName(item.name)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Nama tidak boleh kosong.")
      return
    }
    try {
      setSaving(true)
      if (editItem) {
        await api.put(`/master-data/${entityType}/${editItem.id}`, { name: name.trim() })
        toast.success(`${singular} berhasil diperbarui.`)
      } else {
        await api.post(`/master-data/${entityType}`, { name: name.trim() })
        toast.success(`${singular} berhasil ditambahkan.`)
      }
      setDialogOpen(false)
      setName("")
      setEditItem(null)
      fetchItems()
    } catch (error) {
      console.error("Error saving:", error)
      const errorMsg = error.response?.data?.detail || "Gagal menyimpan data."
      toast.error(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus ${singular.toLowerCase()} "${item.name}"?`)) return
    try {
      await api.delete(`/master-data/${entityType}/${item.id}`)
      toast.success(`${singular} berhasil dihapus.`)
      fetchItems()
    } catch (error) {
      console.error("Error deleting:", error)
      const errorMsg = error.response?.data?.detail || "Gagal menghapus data."
      toast.error(errorMsg)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} {label.toLowerCase()} terdaftar</p>
        <Button size="sm" onClick={openCreate}>
          Tambah {singular}
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground animate-pulse">Memuat data...</p>
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Belum ada {label.toLowerCase()} yang terdaftar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead className="w-[140px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item)}>
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? `Edit ${singular}` : `Tambah ${singular} Baru`}</DialogTitle>
            <DialogDescription>
              {editItem ? `Ubah nama ${singular.toLowerCase()} ini.` : `Masukkan nama ${singular.toLowerCase()} baru.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Nama ${singular.toLowerCase()}`}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminMasterDataPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Master Data</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Kelola kategori, gedung, lokasi, dan satpam
        </p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList className="grid w-full grid-cols-4">
          {ENTITY_TYPES.map((entity) => (
            <TabsTrigger key={entity.key} value={entity.key}>
              {entity.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {ENTITY_TYPES.map((entity) => (
          <TabsContent key={entity.key} value={entity.key}>
            <MasterDataTable
              entityType={entity.key}
              label={entity.label}
              singular={entity.singular}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
