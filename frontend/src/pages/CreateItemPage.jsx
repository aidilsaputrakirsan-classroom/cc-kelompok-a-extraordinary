import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"

export default function CreateItemPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    description: "",
    security_officer_id: ""
  })
  const [images, setImages] = useState([])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.type === 'found' && !formData.security_officer_id) {
      toast.error("Untuk barang temuan, wajib mengisi ID atau Nama Satpam Penitipan.")
      return
    }

    try {
      setLoading(true)
      const payload = {
        type: formData.type,
        title: formData.title,
        description: formData.description || undefined,
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
              <select 
                id="type"
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background focus-visible:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="lost">Laporan Barang Hilang</option>
                <option value="found">Laporan Barang Temuan</option>
              </select>
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

            {formData.type === 'found' && (
              <div className="space-y-2 p-4 border rounded-md bg-secondary/30">
                <Label htmlFor="security_officer_id" className="text-destructive font-semibold">
                  Satpam Penitipan (Wajib Untuk Barang Temuan)
                </Label>
                <Input 
                  id="security_officer_id" 
                  name="security_officer_id" 
                  required={formData.type === 'found'} 
                  value={formData.security_officer_id} 
                  onChange={handleChange} 
                  placeholder="Masukkan Nama atau ID Satpam Penerima Titipan" 
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="images">Upload Foto Barang (Max 4 foto)</Label>
              <Input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} />
              
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {images.map((src, idx) => (
                    <img key={`img-${idx}-${Date.now()}`} src={src} alt={`Preview ${idx+1}`} className="object-cover w-full h-24 rounded-md border" />
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
