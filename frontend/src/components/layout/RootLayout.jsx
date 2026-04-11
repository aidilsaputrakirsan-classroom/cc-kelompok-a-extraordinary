import { Outlet, Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/providers"

export default function RootLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link to="/" className="text-xl font-bold tracking-tight">Temuin</Link>
          <nav className="flex items-center gap-4">
            {user && <span className="hidden text-sm text-muted-foreground md:inline-block">{user.email}</span>}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Keluar
            </Button>
          </nav>
        </div>
      </header>
      <main className="container flex-1 px-4 py-8 mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
