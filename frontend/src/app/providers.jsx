import { createContext, useContext, useState, useEffect } from "react"
import { auth } from "@/config/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const internalToken = localStorage.getItem('internalToken')
      // Validasi: Harus login firebase dan ada internal JWT token
      if (firebaseUser && internalToken) {
        setUser(firebaseUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem('internalToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
