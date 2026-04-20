import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { BellDotIcon, FolderSearch2Icon, LayoutGridIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react"

import { buttonVariants, Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/app/providers"

const primaryLinks = [
  { to: "/items", label: "Daftar Barang", icon: FolderSearch2Icon },
  { to: "/my-items", label: "Barang Saya", icon: LayoutGridIcon },
  { to: "/my-claims", label: "Klaim Saya", icon: SparklesIcon },
  { to: "/notifications", label: "Notifikasi", icon: BellDotIcon },
]

const adminLinks = [
  { to: "/admin/claims", label: "Kelola Klaim" },
  { to: "/admin/master-data", label: "Master Data" },
]

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
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <Link to="/" className="group flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-[0_14px_30px_-16px_rgba(113,50,245,0.45)]">
                  <span className="text-lg font-semibold">T</span>
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold tracking-tight text-balance">Temuin</p>
                  <p className="text-sm text-muted-foreground">Lost & found resmi lingkungan ITK</p>
                </div>
              </Link>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <div className="hidden items-center gap-2 lg:flex">
                {user && (
                  <>
                    <Badge variant="secondary" className="bg-brand-soft text-brand">
                      {isAdmin ? "Admin Workspace" : "Akun Aktif"}
                    </Badge>
                    <span className="max-w-[260px] truncate text-sm text-muted-foreground">{user.email}</span>
                  </>
                )}
                {isAdmin && <ShieldCheckIcon className="text-brand" aria-hidden="true" />}
              </div>

              <nav className="hidden flex-wrap items-center gap-2 md:flex">
                {primaryLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={buttonVariants({
                      variant: isActive(to) ? "secondary" : "ghost",
                      size: "sm",
                      className: "min-w-fit",
                    })}
                  >
                    <Icon data-icon="inline-start" aria-hidden="true" />
                    {label}
                  </Link>
                ))}
                {isAdmin && (
                  <div className="ml-2 flex items-center gap-2 rounded-2xl border border-brand/10 bg-brand-soft/55 p-1">
                    {adminLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className={buttonVariants({
                          variant: isActivePrefix(to) ? "secondary" : "ghost",
                          size: "sm",
                        })}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </nav>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
            {primaryLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={buttonVariants({
                  variant: isActive(to) ? "secondary" : "ghost",
                  size: "sm",
                  className: "shrink-0",
                })}
              >
                <Icon data-icon="inline-start" aria-hidden="true" />
                {label}
              </Link>
            ))}
            {isAdmin && adminLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={buttonVariants({
                  variant: isActivePrefix(to) ? "secondary" : "ghost",
                  size: "sm",
                  className: "shrink-0",
                })}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 md:px-6 md:py-10">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Temuin membantu laporan barang hilang dan penemuan barang terasa lebih jelas, cepat, dan tertata.</p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {user && <span className="truncate">{user.email}</span>}
              {isAdmin && <Badge variant="outline" className="border-brand/20 bg-brand-soft/40 text-brand">Admin</Badge>}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Keluar
          </Button>
        </div>
      </footer>
    </div>
  )
}
