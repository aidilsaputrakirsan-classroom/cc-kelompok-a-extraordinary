import { useState } from "react"

function LoginPage({ onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isRegister) {
        if (!formData.name.trim()) {
          setError("Nama wajib diisi")
          setLoading(false)
          return
        }
        if (formData.password.length < 8) {
          setError("Password minimal 8 karakter")
          setLoading(false)
          return
        }
        await onRegister(formData)
      } else {
        await onLogin(formData.email, formData.password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>☁️ Cloud App</h1>
        <p style={styles.subtitle}>Komputasi Awan — SI ITK</p>

        {/* Tab Switch */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(isRegister ? {} : styles.tabActive) }}
            onClick={() => { setIsRegister(false); setError("") }}
          >
            Login
          </button>
          <button
            style={{ ...styles.tab, ...(isRegister ? styles.tabActive : {}) }}
            onClick={() => { setIsRegister(true); setError("") }}
          >
            Register
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <div style={styles.field}>
              <label style={styles.label}>Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama Lengkap"
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@student.itk.ac.id"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 8 karakter"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.btnSubmit} disabled={loading}>
            {loading ? "⏳ Loading..." : isRegister ? "📝 Register" : "🔐 Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F4E79",
    padding: "2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "2.5rem",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    margin: "0 0 0.25rem 0",
    color: "#1F4E79",
    fontSize: "2rem",
  },
  subtitle: {
    textAlign: "center",
    color: "#888",
    margin: "0 0 1.5rem 0",
    fontSize: "0.9rem",
  },
  tabs: {
    display: "flex",
    marginBottom: "1.5rem",
    borderRadius: "8px",
    overflow: "hidden",
    border: "2px solid #e0e0e0",
  },
  tab: {
    flex: 1,
    padding: "0.7rem",
    border: "none",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "bold",
    color: "#888",
  },
  tabActive: {
    backgroundColor: "#1F4E79",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "2px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
  },
  btnSubmit: {
    padding: "0.8rem",
    backgroundColor: "#548235",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
  error: {
    backgroundColor: "#FBE5D6",
    color: "#C00000",
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
    textAlign: "center",
  },
}

export default LoginPage