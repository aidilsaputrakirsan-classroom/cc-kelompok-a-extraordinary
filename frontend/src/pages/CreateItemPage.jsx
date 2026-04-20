import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ImagePlusIcon, ShieldCheckIcon, X } from "lucide-react"

import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    security_officer_id: "",
  })
  const [images, setImages] = useState([])

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
        api.get("/master-data/categories/"),
        api.get("/master-data/buildings/"),
        api.get("/master-data/locations/"),
        api.get("/master-data/security-officers/"),
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 4) {
      toast.error("Maksimal 4 foto yang diizinkan.")
      return
    }

    files.forEach((file) => {
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

          setImages((prev) => {
            if (prev.length < 4) return [...prev, base64String]
            return prev
          })
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.type === "found" && !formData.security_officer_id) {
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
        images: images.map((img, idx) => ({ image_data: img, display_order: idx })),
      }
      const response = await api.post("/items/", payload)
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

  if (masterDataLoading) return <PageState state="loading" loadingText="Memuat formulir…" />
  if (masterDataError) return <PageState state="error" errorText={masterDataError} onRetry={fetchMasterData} />

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 md:gap-8">
      <section className="rounded-[2rem] border border-brand/10 bg-surface-elevated/85 p-6 shadow-[0_22px_60px_-34px_rgba(83,40,190,0.32)] backdrop-blur md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <Badge variant="secondary" className="w-fit bg-brand-soft text-brand">
              Formulir Pelaporan
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Laporkan barang hilang atau barang temuan dengan informasi yang lebih rapi.</h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Isi detail utama, pilih lokasi yang relevan, lalu tambahkan foto agar laporan lebih mudah dipahami saat dibaca oleh pengguna lain maupun admin.
            </p>
          </div>
          <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
            Kembali
          </Button>
        </div>
      </section>

      <Card className="bg-surface-elevated/80">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Buat Laporan Baru</CardTitle>
            <CardDescription>Pastikan deskripsi dan lokasi cukup spesifik agar proses pencarian atau klaim lebih lancar.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 pb-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Tipe Laporan</Label>
                <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
                  <SelectTrigger id="type" aria-label="Pilih tipe laporan">
                    <SelectValue placeholder="Pilih tipe laporan">
                      {formData.type === "lost" ? "Laporan Barang Hilang" : "Laporan Barang Temuan"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">Laporan Barang Hilang</SelectItem>
                    <SelectItem value="found">Laporan Barang Temuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Nama Barang</Label>
                <Input id="title" name="title" required value={formData.title} onChange={handleChange} placeholder="Contoh: Dompet kulit cokelat…" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Deskripsi Lengkap / Spesifik</Label>
              <Textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Cantumkan ciri khas, isi penting, warna, atau perkiraan lokasi terakhir…"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Kategori (Opsional)</Label>
                <Select value={formData.category_id || "_none"} onValueChange={(v) => handleSelectChange("category_id", v)}>
                  <SelectTrigger aria-label="Pilih kategori barang">
                    <SelectValue placeholder="Pilih kategori">
                      {formData.category_id ? categories.find((c) => c.id === formData.category_id)?.name || "Pilih kategori" : "Tidak ada kategori"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Tidak Ada</SelectItem>
                    {categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Gedung (Opsional)</Label>
                <Select value={formData.building_id || "_none"} onValueChange={(v) => handleSelectChange("building_id", v)}>
                  <SelectTrigger aria-label="Pilih gedung">
                    <SelectValue placeholder="Pilih gedung">
                      {formData.building_id ? buildings.find((building) => building.id === formData.building_id)?.name || "Pilih gedung" : "Tidak ada gedung"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Tidak Ada</SelectItem>
                    {buildings.map((building) => <SelectItem key={building.id} value={building.id}>{building.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <Label>Lokasi Area (Opsional)</Label>
                <Select value={formData.location_id || "_none"} onValueChange={(v) => handleSelectChange("location_id", v)}>
                  <SelectTrigger aria-label="Pilih lokasi area">
                    <SelectValue placeholder="Pilih lokasi area">
                      {formData.location_id ? locations.find((location) => location.id === formData.location_id)?.name || "Pilih lokasi" : "Tidak ada lokasi"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Tidak Ada</SelectItem>
                    {locations.map((location) => <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === "found" && (
              <div className="rounded-[1.5rem] border border-info/20 bg-info-soft/55 p-5">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-info-soft text-info-foreground">
                    <ShieldCheckIcon aria-hidden="true" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-info-foreground">Satpam Penitipan Wajib Dipilih</p>
                    <p className="text-sm text-muted-foreground">Barang temuan harus dihubungkan ke satpam resmi agar alur klaim dan pengambilan tetap jelas.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Satpam Penitipan</Label>
                  <Select value={formData.security_officer_id || "_none"} onValueChange={(v) => handleSelectChange("security_officer_id", v)}>
                    <SelectTrigger aria-label="Pilih satpam penitipan">
                      <SelectValue placeholder="Pilih satpam penitipan">
                        {formData.security_officer_id ? securityOfficers.find((officer) => officer.id === formData.security_officer_id)?.name || "Pilih satpam" : "Pilih satpam penitipan"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Belum Dipilih</SelectItem>
                      {securityOfficers.map((officer) => <SelectItem key={officer.id} value={officer.id}>{officer.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 rounded-[1.5rem] border border-border/80 bg-surface-soft/70 p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <ImagePlusIcon aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-foreground">Tambahkan Foto Pendukung</p>
                  <p className="text-sm text-muted-foreground">Unggah maksimal 4 foto agar barang lebih mudah dikenali. Foto akan dikompresi otomatis sebelum dikirim.</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="images">Upload Foto Barang</Label>
                <Input id="images" name="images" type="file" accept="image/*" multiple onChange={handleImageUpload} />
              </div>

              {images.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {images.map((src, idx) => (
                    <div key={`img-${idx}`} className="relative overflow-hidden rounded-2xl border border-border/80 bg-background">
                      <img src={src} alt={`Preview foto ${idx + 1}`} className="h-28 w-full object-cover" />
                      <button
                        type="button"
                        aria-label={`Hapus foto ${idx + 1}`}
                        onClick={() => removeImage(idx)}
                        className="absolute right-3 top-3 rounded-full bg-background/90 p-1.5 text-foreground shadow-sm transition-[background-color,color,box-shadow] duration-200 hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="justify-between gap-3">
            <p className="text-sm text-muted-foreground">Pastikan semua informasi inti sudah benar sebelum dikirim.</p>
            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Menyimpan Data…" : "Kirim Laporan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
