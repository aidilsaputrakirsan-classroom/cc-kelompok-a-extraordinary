import { createBrowserRouter } from "react-router-dom"
import RootLayout from "@/components/layout/RootLayout"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      }
    ]
  }
])
