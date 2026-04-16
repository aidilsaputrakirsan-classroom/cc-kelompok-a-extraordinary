import { createBrowserRouter } from "react-router-dom"
import RootLayout from "@/components/layout/RootLayout"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import ItemListPage from "@/pages/ItemListPage"
import ItemDetailPage from "@/pages/ItemDetailPage"
import CreateItemPage from "@/pages/CreateItemPage"
import MyItemsPage from "@/pages/MyItemsPage"
import MyClaimsPage from "@/pages/MyClaimsPage"
import NotificationsPage from "@/pages/NotificationsPage"
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
      },
      {
        path: "items",
        element: <ItemListPage />,
      },
      {
        path: "items/create",
        element: <CreateItemPage />,
      },
      {
        path: "items/:id",
        element: <ItemDetailPage />,
      },
      {
        path: "my-items",
        element: <MyItemsPage />,
      },
      {
        path: "my-claims",
        element: <MyClaimsPage />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      }
    ]
  }
])
