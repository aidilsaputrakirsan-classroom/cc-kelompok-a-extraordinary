import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/config/firebase"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      
      // Simulasi request API ke backend
      const response = await api.post('/auth/login', { token: idToken })
      
      // Sesuai rancangan FE-2.1 -> akan dilengkapi pada FE-2.2 (Context/State)
      localStorage.setItem('internalToken', response.data?.token || 'dummy_internal_token_fe_2.1')
      
      toast.success("Login berhasil!")
      navigate("/")
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Gagal masuk.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Masuk ke Temuin</CardTitle>
          <CardDescription>Gunakan email kampus (itk.ac.id)</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full" 
            onClick={handleGoogleLogin} 
            disabled={loading}
          >
            {loading ? "Memproses..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
