import { useState, useEffect } from "react"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import PageState from "@/components/PageState"
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
  const [error, setError] = useState(null)
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState(null)

  const fetchItems = async (signal) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/api/master-data/${entityType}`, { signal })
      const data = response.data?.data || response.data || []
      if (Array.isArray(data)) setItems(data)
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
      console.error(`Error fetching ${entityType}:`, err)
      setError(`Gagal memuat data ${label.toLowerCase()}.`)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchItems(controller.signal)
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType])

  const openCreate = () => {
    setEditItem(null)
    setName("")
    setActionError(null)
    setDialogOpen(true)
  }

  const openEdit = (item) => {
    setEditItem(item)
    setName(item.name)
    setActionError(null)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Nama tidak boleh kosong.")
      return
    }
    try {
      setSaving(true)
      setActionError(null)
      if (editItem) {
        await api.put(`/api/master-data/${entityType}/${editItem.id}`, { name: name.trim() })
        toast.success(`${singular} berhasil diperbarui.`)
      } else {
        await api.post(`/api/master-data/${entityType}`, { name: name.trim() })
        toast.success(`${singular} berhasil ditambahkan.`)
      }
      setDialogOpen(false)
      setName("")
      setEditItem(null)
      fetchItems()
    } catch (err) {
      console.error("Error saving:", err)
      const errorMsg = err.response?.data?.detail || "Gagal menyimpan data."
      setActionError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus ${singular.toLowerCase()} "${item.name}"?`)) return
    try {
      setDeletingId(item.id)
      setActionError(null)
      await api.delete(`/api/master-data/${entityType}/${item.id}`)
      toast.success(`${singular} berhasil dihapus.`)
      fetchItems()
    } catch (err) {
      console.error("Error deleting:", err)
      const errorMsg = err.response?.data?.detail || "Gagal menghapus data."
      setActionError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <PageState state="loading" loadingText={`Memuat data ${label.toLowerCase()}...`} />
  if (error) return <PageState state="error" errorText={error} onRetry={() => fetchItems()} />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} {label.toLowerCase()} terdaftar</p>
        <Button size="sm" onClick={openCreate}>
          Tambah {singular}
        </Button>
      </div>

      {actionError && (
        <Alert variant="destructive">
          <AlertTitle>Aksi admin gagal</AlertTitle>
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      {items.length === 0 ? (
        <PageState state="empty" emptyText={`Belum ada ${label.toLowerCase()} yang terdaftar.`} />
      ) : (
        <div className="border rounded-md divide-y">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-card">
              <span className="font-medium text-sm">{item.name}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(item)} disabled={deletingId === item.id}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item)} disabled={deletingId === item.id}>
                  {deletingId === item.id ? "Menghapus..." : "Hapus"}
                </Button>
              </div>
            </div>
          ))}
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
          {actionError && (
            <Alert variant="destructive">
              <AlertTitle>Gagal menyimpan data</AlertTitle>
              <AlertDescription>{actionError}</AlertDescription>
            </Alert>
          )}
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
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Batal</Button>
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
  const [activeTab, setActiveTab] = useState(ENTITY_TYPES[0].key)

  const currentEntity = ENTITY_TYPES.find(e => e.key === activeTab)

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Master Data</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Kelola kategori, gedung, lokasi, dan satpam
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b">
        {ENTITY_TYPES.map((entity) => (
          <Button
            key={entity.key}
            variant={activeTab === entity.key ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(entity.key)}
            className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
            data-active={activeTab === entity.key}
          >
            {entity.label}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {currentEntity && (
          <MasterDataTable
            key={currentEntity.key}
            entityType={currentEntity.key}
            label={currentEntity.label}
            singular={currentEntity.singular}
          />
        )}
      </div>
    </div>
  )
}
