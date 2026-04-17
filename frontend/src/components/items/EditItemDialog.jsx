import { useState, useEffect } from "react"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import PageState from "@/components/PageState"

export function EditItemDialog({ isOpen, onClose, item, onSuccess }) {
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    building_id: "",
    location_id: "",
    security_officer_id: ""
  })

  // Master data state
  const [masterDataLoading, setMasterDataLoading] = useState(false)
  const [masterDataError, setMasterDataError] = useState(null)
  
  const [categories, setCategories] = useState([])
  const [buildings, setBuildings] = useState([])
  const [locations, setLocations] = useState([])
  const [securityOfficers, setSecurityOfficers] = useState([])

  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        category_id: item.category_id || "",
        building_id: item.building_id || "",
        location_id: item.location_id || "",
        security_officer_id: item.security_officer_id || ""
      })
      fetchMasterData()
    }
  }, [item, isOpen])

  const fetchMasterData = async () => {
    try {
      setMasterDataLoading(true)
      setMasterDataError(null)
      
      const [catRes, buildRes, locRes, soRes] = await Promise.all([
        api.get('/master-data/categories'),
        api.get('/master-data/buildings'),
        api.get('/master-data/locations'),
        api.get('/master-data/security-officers'),
      ])
      
      setCategories(catRes.data?.data || catRes.data || [])
      setBuildings(buildRes.data?.data || buildRes.data || [])
      setLocations(locRes.data?.data || locRes.data || [])
      setSecurityOfficers(soRes.data?.data || soRes.data || [])
    } catch (err) {
      console.error("Error fetching master data:", err)
      setMasterDataError("Gagal memuat data referensi. Silakan coba lagi.")
    } finally {
      setMasterDataLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value === "_none" ? "" : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        category_id: formData.category_id || undefined,
        building_id: formData.building_id || undefined,
        location_id: formData.location_id || undefined,
        security_officer_id: formData.security_officer_id || undefined
      }
      
      const response = await api.put(`/items/${item.id}`, payload)
      if (response.status === 200) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error updating item:", error)
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Gagal mengupdate laporan. Silakan coba lagi."
      // Assuming parent will show toast based on error, or we can toast here if we pass toast function
      throw errorMsg
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Laporan</DialogTitle>
          <DialogDescription>
            Perbarui detail informasi barang yang hilang atau ditemukan.
          </DialogDescription>
        </DialogHeader>

        {masterDataLoading ? (
           <PageState state="loading" loadingText="Memuat formulir..." />
        ) : masterDataError ? (
           <PageState state="error" errorText={masterDataError} onRetry={fetchMasterData} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nama Barang</Label>
              <Input id="title" name="title" required value={formData.title} onChange={handleChange} placeholder="Contoh: Kunci Motor Honda" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Lengkap / Spesifik</Label>
              <textarea 
                id="description"
                name="description" 
                required 
                value={formData.description} 
                onChange={handleChange}
                className="flex w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Cantumkan detail ciri-ciri spesifik dan perkiraan lokasi kejadian..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori (Opsional)</Label>
                <Select value={formData.category_id || "_none"} onValueChange={(v) => handleSelectChange("category_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori">
                      {formData.category_id ? categories.find(c => c.id === formData.category_id)?.name || "Pilih Kategori" : "-- Tidak Ada --"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">-- Tidak Ada --</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gedung (Opsional)</Label>
                <Select value={formData.building_id || "_none"} onValueChange={(v) => handleSelectChange("building_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Gedung">
                      {formData.building_id ? buildings.find(b => b.id === formData.building_id)?.name || "Pilih Gedung" : "-- Tidak Ada --"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">-- Tidak Ada --</SelectItem>
                    {buildings.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Lokasi Area (Opsional)</Label>
                <Select value={formData.location_id || "_none"} onValueChange={(v) => handleSelectChange("location_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Lokasi">
                      {formData.location_id ? locations.find(l => l.id === formData.location_id)?.name || "Pilih Lokasi" : "-- Tidak Ada --"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">-- Tidak Ada --</SelectItem>
                    {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {item?.type === 'found' && (
              <div className="space-y-2 p-4 border rounded-md bg-secondary/30">
                <Label className="font-semibold">
                  Satpam Penitipan
                </Label>
                <Select value={formData.security_officer_id || "_none"} onValueChange={(v) => handleSelectChange("security_officer_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Satpam">
                      {formData.security_officer_id ? securityOfficers.find(s => s.id === formData.security_officer_id)?.name || "Pilih Satpam" : "-- Pilih Satpam --"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">-- Pilih Satpam --</SelectItem>
                    {securityOfficers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
