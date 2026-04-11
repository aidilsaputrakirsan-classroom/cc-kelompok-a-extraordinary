import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithPopup } from "firebase/auth"
import { useAuth } from "@/app/providers"
import { auth, googleProvider } from "@/config/firebase"
import { api } from "@/config/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

function getErrorMessage(error) {
  const detail = error.response?.data?.detail

  if (typeof detail === "string") {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.message || item?.msg || JSON.stringify(item))
      .join("; ")
  }

  if (detail && typeof detail === "object") {
    return detail.message || JSON.stringify(detail)
  }

  return error.message || "Gagal masuk."
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setInternalToken } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      
      const response = await api.post('/auth/login', { id_token: idToken })
      setInternalToken(response.data.access_token)

      toast.success("Login berhasil!")
      navigate("/")
    } catch (error) {
      console.error(error)
      toast.error(getErrorMessage(error))
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
