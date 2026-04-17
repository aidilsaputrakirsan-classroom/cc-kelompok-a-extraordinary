import { Navigate } from "react-router-dom"
import { useAuth } from "@/app/providers"

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-muted-foreground animate-pulse">Memuat data...</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-lg font-semibold text-destructive">Akses Ditolak</p>
        <p className="text-sm text-muted-foreground">Halaman ini hanya untuk admin.</p>
      </div>
    )
  }

  return children
}
