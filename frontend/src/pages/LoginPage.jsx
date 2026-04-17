import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/app/providers"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await api.post("/auth/login/", { email, password })
      const { access_token } = response.data

      // Simpan token dulu agar interceptor bisa pakai
      localStorage.setItem("internalToken", access_token)

      // Fetch user profile
      const meResponse = await api.get("/auth/me")
      login(access_token, meResponse.data)

      toast.success("Login berhasil!")
      navigate("/")
    } catch (error) {
      const detail = error.response?.data?.detail
      toast.error(typeof detail === "string" ? detail : "Gagal masuk.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Masuk ke Temuin</CardTitle>
          <CardDescription>Gunakan email kampus (itk.ac.id)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Daftar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
