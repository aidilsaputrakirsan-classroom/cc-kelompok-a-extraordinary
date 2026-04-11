import { RouterProvider } from "react-router-dom"
import { router } from "@/app/router"
import { AuthProvider } from "@/app/providers"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  )
}

export default App
