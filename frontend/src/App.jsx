import { RouterProvider } from "react-router-dom"
import { router } from "@/app/router"
import { AuthProvider } from "@/app/providers"
import AppErrorBoundary from "@/components/AppErrorBoundary"
import ServiceErrorBanner from "@/components/ServiceErrorBanner"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <ServiceErrorBanner />
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </AppErrorBoundary>
  )
}

export default App
