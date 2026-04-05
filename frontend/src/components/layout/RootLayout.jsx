import { Outlet, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link to="/" className="text-xl font-bold">Temuin</Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
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
