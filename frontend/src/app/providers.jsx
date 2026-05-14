/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react"
import { api } from "@/config/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("internalToken")
    if (!token) {
      setLoading(false)
      return
    }

    const controller = new AbortController()
    api.get("/auth/me", { signal: controller.signal })
      .then((res) => {
        if (!controller.signal.aborted) setUser(res.data)
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
        // Token expired atau invalid
        localStorage.removeItem("internalToken")
        setUser(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
      
    return () => controller.abort()
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
