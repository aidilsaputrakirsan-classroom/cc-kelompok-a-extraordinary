import { useState, useEffect, useCallback } from "react"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import LoginPage from "./components/LoginPage"
import Toast from "./components/Toast"
import LoadingSpinner from "./components/LoadingSpinner"
import {
  fetchItems, createItem, updateItem, deleteItem,
  checkHealth, login, register, setToken, clearToken, getToken,
} from "./services/api"

function App() {
  // ==================== AUTH STATE ====================
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ==================== APP STATE ====================
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // ==================== TOAST STATE ====================
  const [toast, setToast] = useState(null) // { message, type }

  // ==================== ACTION LOADING STATE ====================
  const [actionLoading, setActionLoading] = useState(false)

  // ==================== INIT AUTH ON MOUNT ====================
  // Cek token yang tersimpan saat aplikasi pertama kali load
  useEffect(() => {
    const token = getToken()
    if (token) {
      // Token ada, user dianggap sudah login
      setIsAuthenticated(true)
    }
  }, [])

  // ==================== TOAST HELPER ====================
  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type })
  }, [])

  // ==================== LOAD DATA ====================
  const loadItems = useCallback(async (search = "") => {
    setLoading(true)
    try {
      const data = await fetchItems(search)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        handleLogout()
      } else {
        showToast(err.message, "error")
      }
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    checkHealth().then(setIsConnected)
  }, [])

  // Load items saat mount jika token sudah ada (setelah refresh)
  // Saat login, loadItems dipanggil langsung di handleLogin
  useEffect(() => {
    const token = getToken()
    if (token && !user) {
      // Token ada tapi user belum di-set (refresh scenario)
      loadItems()
    }
  }, [])

  // ==================== AUTH HANDLERS ====================

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password)
      setUser(data.user || { email })
      setIsAuthenticated(true)
      showToast("Login berhasil!", "success")
      await loadItems()
    } catch (err) {
      showToast(err.message || "Login gagal", "error")
      throw err
    }
  }

  const handleRegister = async (userData) => {
    try {
      await register(userData)
      await handleLogin(userData.email, userData.password)
      showToast("Registrasi berhasil!", "success")
    } catch (err) {
      showToast(err.message || "Registrasi gagal", "error")
      throw err
    }
  }

  const handleLogout = () => {
    clearToken()
    setUser(null)
    setIsAuthenticated(false)
    setItems([])
    setTotalItems(0)
    setEditingItem(null)
    setSearchQuery("")
  }

  // ==================== ITEM HANDLERS ====================

  const handleSubmit = async (itemData, editId) => {
    setActionLoading(true)
    try {
      if (editId) {
        await updateItem(editId, itemData)
        setEditingItem(null)
        showToast("Item berhasil diupdate!", "success")
      } else {
        await createItem(itemData)
        showToast("Item berhasil ditambahkan!", "success")
      }
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        handleLogout()
      } else {
        showToast(err.message || "Gagal menyimpan item", "error")
      }
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return
    setActionLoading(true)
    try {
      await deleteItem(id)
      showToast("Item berhasil dihapus!", "success")
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        handleLogout()
      } else {
        showToast(err.message || "Gagal menghapus item", "error")
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadItems(query)
  }

  // ==================== RENDER ====================

  // Jika belum login, tampilkan login page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    )
  }

  // Jika sudah login, tampilkan main app
  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <Header
          totalItems={totalItems}
          isConnected={isConnected}
          user={user}
          onLogout={handleLogout}
        />
        <ItemForm
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(null)}
          loading={actionLoading}
        />
        <SearchBar onSearch={handleSearch} />
        <ItemList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading || actionLoading}
        />
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  container: { maxWidth: "900px", margin: "0 auto" },
}

export default App