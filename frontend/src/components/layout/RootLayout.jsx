import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/providers"

export default function RootLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  const isAdmin = user?.role === "admin" || user?.role === "superadmin"
  const isActive = (path) => location.pathname === path
  const isActivePrefix = (prefix) => location.pathname.startsWith(prefix)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold tracking-tight">Temuin</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/items"
                className={`text-sm transition-colors ${
                  isActive('/items')
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Daftar Barang
              </Link>
              <Link
                to="/my-items"
                className={`text-sm transition-colors ${
                  isActive('/my-items')
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Barang Saya
              </Link>
              <Link
                to="/my-claims"
                className={`text-sm transition-colors ${
                  isActive('/my-claims')
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Klaim Saya
              </Link>
              <Link
                to="/notifications"
                className={`text-sm transition-colors ${
                  isActive('/notifications')
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Notifikasi
              </Link>
              {isAdmin && (
                <>
                  <span className="text-muted-foreground/40">|</span>
                  <Link
                    to="/admin/claims"
                    className={`text-sm transition-colors ${
                      isActivePrefix('/admin/claims')
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Kelola Klaim
                  </Link>
                  <Link
                    to="/admin/master-data"
                    className={`text-sm transition-colors ${
                      isActivePrefix('/admin/master-data')
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Master Data
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden border-t bg-card">
          <div className="container px-4 py-2 flex flex-wrap gap-2">
            <Link to="/items">
              <Button variant="ghost" size="sm" className={isActive('/items') ? 'bg-accent' : ''}>
                Daftar
              </Button>
            </Link>
            <Link to="/my-items">
              <Button variant="ghost" size="sm" className={isActive('/my-items') ? 'bg-accent' : ''}>
                Saya
              </Button>
            </Link>
            <Link to="/my-claims">
              <Button variant="ghost" size="sm" className={isActive('/my-claims') ? 'bg-accent' : ''}>
                Klaim
              </Button>
            </Link>
            <Link to="/notifications">
              <Button variant="ghost" size="sm" className={isActive('/notifications') ? 'bg-accent' : ''}>
                Notif
              </Button>
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin/claims">
                  <Button variant="ghost" size="sm" className={isActivePrefix('/admin/claims') ? 'bg-accent' : ''}>
                    Kelola Klaim
                  </Button>
                </Link>
                <Link to="/admin/master-data">
                  <Button variant="ghost" size="sm" className={isActivePrefix('/admin/master-data') ? 'bg-accent' : ''}>
                    Master Data
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container flex-1 px-4 py-8 mx-auto">
        <Outlet />
      </main>

      <footer className="border-t bg-card">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden text-sm text-muted-foreground md:inline-block">
                {user.email}
                {isAdmin && <span className="ml-2 text-xs font-medium text-primary">[Admin]</span>}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Keluar
          </Button>
        </div>
      </footer>
    </div>
  )
}
