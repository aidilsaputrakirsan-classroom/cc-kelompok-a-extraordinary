import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/app/providers"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!email.endsWith("itk.ac.id")) {
      toast.error("Hanya email itk.ac.id yang diizinkan")
      return
    }

    if (password.length < 8) {
      toast.error("Password minimal 8 karakter")
      return
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error("Password harus mengandung huruf dan angka")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Password tidak cocok")
      return
    }

    try {
      setLoading(true)
      const response = await api.post("/auth/register/", { email, password, name })
      const { access_token } = response.data

      localStorage.setItem("internalToken", access_token)
      const meResponse = await api.get("/auth/me")
      login(access_token, meResponse.data)

      toast.success("Registrasi berhasil!")
      navigate("/")
    } catch (error) {
      const detail = error.response?.data?.detail
      toast.error(typeof detail === "string" ? detail : "Gagal mendaftar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Daftar Temuin</CardTitle>
          <CardDescription>Buat akun dengan email kampus (itk.ac.id)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nim@student.itk.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 8 karakter, huruf dan angka"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
