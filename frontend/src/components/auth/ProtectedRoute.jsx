import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/app/providers"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-muted-foreground animate-pulse">Memuat data...</span>
      </div>
    )
  }

  if (!user) {
    // Redirect ke login, lempar origin state
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
