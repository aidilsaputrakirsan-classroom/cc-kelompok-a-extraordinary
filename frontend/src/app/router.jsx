import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import RootLayout from "@/components/layout/RootLayout"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import AdminRoute from "@/components/auth/AdminRoute"
import PageState from "@/components/PageState"

const Loadable = (Component) => (props) => (
  <Suspense fallback={<PageState state="loading" loadingText="Memuat halaman..." />}>
    <Component {...props} />
  </Suspense>
);

const ItemListPage = Loadable(lazy(() => import("@/pages/ItemListPage")))
const ItemDetailPage = Loadable(lazy(() => import("@/pages/ItemDetailPage")))
const CreateItemPage = Loadable(lazy(() => import("@/pages/CreateItemPage")))
const MyItemsPage = Loadable(lazy(() => import("@/pages/MyItemsPage")))
const MyClaimsPage = Loadable(lazy(() => import("@/pages/MyClaimsPage")))
const NotificationsPage = Loadable(lazy(() => import("@/pages/NotificationsPage")))
const AdminClaimsPage = Loadable(lazy(() => import("@/pages/AdminClaimsPage")))
const AdminClaimDetailPage = Loadable(lazy(() => import("@/pages/AdminClaimDetailPage")))
const AdminMasterDataPage = Loadable(lazy(() => import("@/pages/AdminMasterDataPage")))

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
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
      },
      {
        path: "admin/claims",
        element: (
          <AdminRoute>
            <AdminClaimsPage />
          </AdminRoute>
        ),
      },
      {
        path: "admin/claims/:id",
        element: (
          <AdminRoute>
            <AdminClaimDetailPage />
          </AdminRoute>
        ),
      },
      {
        path: "admin/master-data",
        element: (
          <AdminRoute>
            <AdminMasterDataPage />
          </AdminRoute>
        ),
      }
    ]
  }
])
