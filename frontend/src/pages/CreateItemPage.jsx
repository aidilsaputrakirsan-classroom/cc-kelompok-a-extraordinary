import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import PageState from "@/components/PageState"
import { toast } from "sonner"

export default function CreateItemPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    description: "",
    category_id: "",
    building_id: "",
    location_id: "",
    security_officer_id: ""
  })
  const [images, setImages] = useState([])

  // Master data state
  const [masterDataLoading, setMasterDataLoading] = useState(true)
  const [masterDataError, setMasterDataError] = useState(null)
  
  const [categories, setCategories] = useState([])
  const [buildings, setBuildings] = useState([])
  const [locations, setLocations] = useState([])
  const [securityOfficers, setSecurityOfficers] = useState([])

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
      toast.error("Gagal memuat data referensi.")
    } finally {
      setMasterDataLoading(false)
    }
  }

  useEffect(() => {
    fetchMasterData()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value === "_none" ? "" : value })
  }

  // Kompresi image ke base64 (< 2MB)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 4) {
      toast.error("Maksimal 4 foto yang diizinkan.")
      return
    }

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const MAX_WIDTH = 800
          const scaleSize = MAX_WIDTH / img.width
          canvas.width = MAX_WIDTH
          canvas.height = img.height * scaleSize
          
          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          const base64String = canvas.toDataURL("image/jpeg", 0.7)
          
          setImages(prev => {
            if(prev.length < 4) return [...prev, base64String]
            return prev
          })
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.type === 'found' && !formData.security_officer_id) {
      toast.error("Untuk barang temuan, wajib memilih Satpam Penitipan.")
      return
    }

    try {
      setLoading(true)
      const payload = {
        type: formData.type,
        title: formData.title,
        description: formData.description || undefined,
        category_id: formData.category_id || undefined,
        building_id: formData.building_id || undefined,
        location_id: formData.location_id || undefined,
        security_officer_id: formData.security_officer_id || undefined,
        images: images.map((img, idx) => ({ image_data: img, display_order: idx }))
      }
      const response = await api.post('/items/', payload)
      if (response.status === 201 || response.status === 200) {
        toast.success("Laporan berhasil dibuat!")
        navigate("/items")
      }
    } catch (error) {
      console.error("Error creating item:", error)
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Gagal membuat laporan. Silakan coba lagi."
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (masterDataLoading) return <PageState state="loading" loadingText="Memuat formulir..." />
  if (masterDataError) return <PageState state="error" errorText={masterDataError} onRetry={fetchMasterData} />

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>Kembali</Button>
        <h2 className="text-3xl font-bold">Buat Laporan Baru</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Formulir Pelaporan</CardTitle>
            <CardDescription>Isi detail informasi barang yang hilang atau ditemukan secara akurat.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipe Laporan</Label>
              <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lost">Laporan Barang Hilang</SelectItem>
                  <SelectItem value="found">Laporan Barang Temuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                    <SelectValue placeholder="Pilih Kategori" />
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
                    <SelectValue placeholder="Pilih Gedung" />
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
                    <SelectValue placeholder="Pilih Lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">-- Tidak Ada --</SelectItem>
                    {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === 'found' && (
              <div className="space-y-2 p-4 border rounded-md bg-secondary/30">
                <Label className="text-destructive font-semibold">
                  Satpam Penitipan (Wajib Untuk Barang Temuan)
                </Label>
                <Select value={formData.security_officer_id || "_none"} onValueChange={(v) => handleSelectChange("security_officer_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Satpam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">-- Pilih Satpam --</SelectItem>
                    {securityOfficers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="images">Upload Foto Barang (Max 4 foto)</Label>
              <Input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} />
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map((src, idx) => (
                    <div key={`img-${idx}`} className="relative group">
                      <img src={src} alt={`Preview ${idx+1}`} className="object-cover w-full h-24 rounded-md border" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </CardContent>
          <CardFooter className="pt-4 border-t border-border">
            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? "Menyimpan data..." : "Kirim Laporan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
