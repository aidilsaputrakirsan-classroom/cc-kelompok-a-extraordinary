function Header({ totalItems, isConnected, user, onLogout }) {
  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>☁️ Cloud App</h1>
        <p style={styles.subtitle}>Komputasi Awan — SI ITK</p>
      </div>
      <div style={styles.right}>
        <div style={styles.stats}>
          <span style={styles.badge}>{totalItems} items</span>
          <span style={{
            ...styles.status,
            backgroundColor: isConnected ? "#E2EFDA" : "#FBE5D6",
            color: isConnected ? "#548235" : "#C00000",
          }}>
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </span>
        </div>
        {user && (
          <div style={styles.user}>
            <span style={styles.userName}>👤 {user.name}</span>
            <button onClick={onLogout} style={styles.btnLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 2rem",
    backgroundColor: "#1F4E79",
    color: "white",
    borderRadius: "12px",
    marginBottom: "1.5rem",
  },
  title: { margin: 0, fontSize: "1.8rem" },
  subtitle: { margin: "0.25rem 0 0 0", fontSize: "0.9rem", opacity: 0.8 },
  right: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" },
  stats: { display: "flex", gap: "0.5rem", alignItems: "center" },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "0.3rem 0.7rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
  },
  status: { padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold" },
  user: { display: "flex", gap: "0.5rem", alignItems: "center" },
  userName: { fontSize: "0.85rem", opacity: 0.9 },
  btnLogout: {
    padding: "0.3rem 0.8rem",
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
}

export default Header