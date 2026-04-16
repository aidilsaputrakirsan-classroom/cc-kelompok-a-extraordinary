import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export function ClaimForm({ itemId, itemTitle, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    verification_answer: "",
    additional_info: ""
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.verification_answer.trim()) {
      newErrors.verification_answer = "Jawaban verifikasi tidak boleh kosong"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      toast.error("Mohon isi semua field yang wajib diisi")
      return
    }

    try {
      await onSubmit({
        item_id: itemId,
        ...formData
      })
    } catch (error) {
      console.error("Error submitting claim:", error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ajukan Klaim Barang</CardTitle>
        <CardDescription>Barang: <span className="font-semibold text-foreground">{itemTitle}</span></CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert>
            <AlertDescription className="text-sm">
              Kami memerlukan pertanyaan verifikasi untuk memastikan Anda adalah pemilik asli barang ini. Jawab dengan jujur dan detail.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="verification_answer" className="text-destructive font-semibold">
              * Ciri-ciri atau identitas khusus barang (untuk verifikasi)
            </Label>
            <Textarea
              id="verification_answer"
              name="verification_answer"
              placeholder="Jelaskan ciri-ciri unik, warna, merek, atau detail lain yang membuktikan Anda pemilik barang ini..."
              value={formData.verification_answer}
              onChange={handleChange}
              className={errors.verification_answer ? "border-destructive" : ""}
              rows={4}
            />
            {errors.verification_answer && (
              <p className="text-sm text-destructive">{errors.verification_answer}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_info">
              Informasi Tambahan (Opsional)
            </Label>
            <Textarea
              id="additional_info"
              name="additional_info"
              placeholder="Tambahkan informasi lain yang relevan, misalnya kapan kehilangan, di mana ditemukan, dll..."
              value={formData.additional_info}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Mengirim klaim..." : "Kirim Klaim"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
