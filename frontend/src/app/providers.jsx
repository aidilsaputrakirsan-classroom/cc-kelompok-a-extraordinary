import { createContext, useContext, useState, useEffect } from "react"
import { auth } from "@/config/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [internalToken, setInternalTokenState] = useState(() => localStorage.getItem("internalToken"))
  const [loading, setLoading] = useState(true)

  const setInternalToken = (token) => {
    if (token) {
      localStorage.setItem("internalToken", token)
      setInternalTokenState(token)
      return
    }

    localStorage.removeItem("internalToken")
    setInternalTokenState(null)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Validasi: Harus login firebase dan ada internal JWT token
      if (firebaseUser && internalToken) {
        setUser(firebaseUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [internalToken])

  const logout = async () => {
    await signOut(auth)
    setInternalToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, setInternalToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
