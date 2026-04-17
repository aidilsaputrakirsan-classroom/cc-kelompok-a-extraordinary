import { createContext, useContext, useState, useEffect } from "react"
import { api } from "@/config/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cek token saat app load - fetch user profile dari backend
  useEffect(() => {
    const token = localStorage.getItem("internalToken")
    if (!token) {
      setLoading(false)
      return
    }

    api.get("/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => {
        // Token expired atau invalid
        localStorage.removeItem("internalToken")
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (token, userData) => {
    localStorage.setItem("internalToken", token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("internalToken")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
